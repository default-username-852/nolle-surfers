import { Terrain } from "./Terrain";
import Player from "./Player";
import { Lane } from "./Lane";
import { SEGMENTS } from "./Segment";
import { TerrainManager } from "./TerrainManager";
import { LOW_OBSTACLE_HEIGHT, ObstacleType } from "./Obstacle";

const INCREASE_SPEED_RATE: number = 0.01;

export class Game {
    currentInstance: GameInstance = new GameInstance();
    bestScore: number | undefined = undefined;

    restartGame() {
        this.bestScore = Math.max(this.currentInstance.score, this.bestScore || 0);
        this.currentInstance = new GameInstance();
    }

    update(delta: number) {
        this.currentInstance.update(delta);
    }

	keyboardEvent(event: KeyboardEvent) {
        switch (event.code) {
            case "Space":
                this.restartGame();
                return;
        }
        this.currentInstance.keyboardEvent(event);
	}
}

export class GameInstance {
    player: Player = new Player();
    terrainManager = new TerrainManager();
    score: number = 0;
    gameSpeed: number = 5;
    generatedFrontier: number = 10; // represents how many units forward has been generated
    worldOffset: number = 0;
    gameOver: boolean = false;

    constructor () {}

    update(delta: number) {
        if (this.gameOver) {
            return;
        }

        this.gameSpeed += delta * INCREASE_SPEED_RATE;

        const worldOffset = this.gameSpeed * delta;
       
        const nextObstacle = this.terrainManager.nextObstacle(this.player.lane);
        
        if(nextObstacle && nextObstacle.offset - worldOffset < 0) { // player hits the obstacle in this update
            switch(nextObstacle.type) {
                case ObstacleType.Under:
                    // TODO
                    break;
                case ObstacleType.Over:
                    if(this.player.height < LOW_OBSTACLE_HEIGHT) {
                        this.gameOver = true;
                        return;
                    }
                    break;
                case ObstacleType.Wall:
                    this.gameOver = true;
                    return;
                case ObstacleType.Bar:
                    // TODO: add rolling
                    if(this.player.height < LOW_OBSTACLE_HEIGHT) {
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

        if(this.generatedFrontier <= 30) {
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

	keyboardEvent(event: KeyboardEvent) {
        if (this.gameOver) {
            return;
        }

        switch (event.code) {
            case "ArrowUp":
                this.player.jump();
                break;
            case "ArrowLeft":
                this.move("left");
                break;
            case "ArrowRight":
                this.move("right");
                break;
            default:
                break;
        }
	}
}
