import { Terrain } from "./Terrain";
import Player, { RunningState } from "./Player";
import { Lane } from "./Lane";
import { SEGMENTS } from "./Segment";
import { TerrainManager } from "./TerrainManager";
import { LOW_OBSTACLE_HEIGHT, ObstacleType } from "./Obstacle";

const INCREASE_SPEED_RATE: number = 0.05;

export class Game {
    started: boolean = false;
    currentInstance: GameInstance = new GameInstance();
    bestScore: number | undefined = undefined;
    loading: boolean = true;

    restartGame() {
        this.bestScore = Math.max(this.currentInstance.score, this.bestScore || 0);
        this.currentInstance = new GameInstance();
    }

    update(delta: number) {
        if(this.started) {
            this.currentInstance.update(delta);
        }
    }

    gesture(direction: "up" | "down" | "left" | "right") {
        this.currentInstance.gesture(direction);
    }
}

export class GameInstance {
    player: Player = new Player();
    terrainManager = new TerrainManager();
    score: number = 0;
    gameSpeed: number = 7.5;
    generatedFrontier: number = 10; // represents how many units forward has been generated
    worldOffset: number = 0;
    gameOver: boolean = false;

    constructor () {}

    update(delta: number) {
        if (delta >= 1) { 
            // ensure that long deltas don't happen
            // to combat lag
            return;
        }
        
        if (this.gameOver) {
            return;
        }

        this.gameSpeed += delta * INCREASE_SPEED_RATE;

        const worldOffset = this.gameSpeed * delta;

        const nextPickup = this.terrainManager.nextPickup(this.player.lane);

        if(
            nextPickup &&
            nextPickup.offset - worldOffset < 0
            && nextPickup.height + 0.35 >= this.player.height
            && nextPickup.height - 2 <= this.player.height
        ) { // player hits the pickup in this update
            this.terrainManager.removePickup(nextPickup.uuid);
            this.score += nextPickup.points();
        }

        const nextObstacle = this.terrainManager.nextObstacle(this.player.lane);

        if(nextObstacle && nextObstacle.offset - worldOffset < 0) { // player hits the obstacle in this update
            switch(nextObstacle.type) {
                case ObstacleType.Under:
                    if (!(this.player.runningState === RunningState.Rolling) && this.player.height < 4) {
                        this.gameOver = true;
                        return;
                    }
                    break;
                case ObstacleType.Over:
                    if(this.player.height < LOW_OBSTACLE_HEIGHT) {
                        this.gameOver = true;
                        return;
                    }
                    break;
                case ObstacleType.WagonStart:
                    // allows the player to go from a wagon or ramp to a wagon
                    // also let player go from nothing to a wagon, if they are high enough
                    if(!this.terrainInLane(this.player.lane) && this.player.height < 4) {
                        this.gameOver = true;
                        return;
                    }
                    break;
                case ObstacleType.Bar:
                    if(this.player.height < LOW_OBSTACLE_HEIGHT && !(this.player.runningState === RunningState.Rolling)) {
                        this.gameOver = true;
                        return;
                    }
                    break;
            }
        }

        this.score += worldOffset;

        this.generatedFrontier -= worldOffset;
        this.worldOffset += worldOffset;

        this.terrainManager.update(worldOffset);

        if(this.generatedFrontier <= -10) {
            this.generatedFrontier = -10;
        }
        
        if(this.generatedFrontier <= 120) {
            this.generateNewSegment();
        }

        let groundHeight = this.groundHeight();

        this.player.update(delta, groundHeight);
    }

    terrainInLane(lane: Lane): Terrain | undefined {
        return this.terrainManager.terrainAt0(lane);
    }

    groundHeight(): number {
        return this.terrainInLane(this.player.lane)?.height() || 0;
    }

    generateNewSegment() {
        const newSegment = SEGMENTS[Math.floor(Math.random()*SEGMENTS.length)];

        for(const l of [Lane.Left, Lane.Center, Lane.Right]) {
            const ts = newSegment.terrain[l];
            for(const t of ts) {
                const newT = t.clone();
                newT.offset += this.generatedFrontier;
                this.terrainManager.addTerrain(newT, l);
            }
            const os = newSegment.obstacle[l];

            for(const o of os) {
                const newO = o.clone();
                newO.offset += this.generatedFrontier;
                this.terrainManager.addObstacle(newO, l);
            }
            const ps = newSegment.pickups[l];

            for(const p of ps) {
                const newP = p.clone();
                newP.offset += this.generatedFrontier;
                this.terrainManager.addPickup(newP, l);
            }
        }

        this.terrainManager.thisDidChange();

        this.generatedFrontier += newSegment.length;
    }

    move(direction: "left" | "right") {
        let newLane;

        switch (direction) {
            case "left":
                if (this.player.lane == Lane.Right) {
                    newLane = Lane.Center;
                } else {
                    newLane = Lane.Left;
                }
                break;
            case "right":
                if (this.player.lane == Lane.Left) {
                    newLane = Lane.Center;
                } else {
                    newLane = Lane.Right;
                }
                break;
        }

        if ((this.terrainInLane(newLane)?.height() || 0) <= this.player.height) {
            this.player.lane = newLane;
        }
    }

	gesture(event: "up" | "down" | "left" | "right") {
        if (this.gameOver) {
            return;
        }

        switch (event) {
            case "up":
                this.player.jump();
                break;
            case "left":
                this.move("left");
                break;
            case "right":
                this.move("right");
                break;
            case "down":
                this.player.roll();
                break;
            default:
                break;
        }
	}
}
