import { Terrain } from "./Terrain";
import Player from "./Player";
import { Lane } from "./Lane";
import { segments } from "./Segment";
import { proxy } from "valtio";
import { TerrainManager } from "./TerrainManager";

const INCREASE_SPEED_RATE: number = 0.01;

export class Game {
    currentInstance: GameInstance = new GameInstance();
    bestScore: number | undefined = undefined;

    restartGame() {
        this.bestScore = this.currentInstance.score;
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
    player: Player;
    terrainManager = new TerrainManager();
    score: number = 0;
    gameSpeed: number = 2.5;
    generatedFrontier: number = 10; // represents how many units forward has been generated
    gameOver: boolean = false;

    constructor () {
        this.player = new Player();
    }

    update(delta: number) {
        if (this.gameOver) {
            return;
        }

        this.gameSpeed += delta * INCREASE_SPEED_RATE;

        const worldOffset = this.gameSpeed * delta;

        this.score += worldOffset;

        this.generatedFrontier -= worldOffset;

        this.terrainManager.update(worldOffset);

        if(this.generatedFrontier <= 30) {
            this.generateNewSegment();
        }

        let groundHeight = this.groundHeight();

        if(groundHeight - 0.1 >= this.player.height) {
            this.update(-delta);
            this.gameOver = true;
            return;
        }

        this.player.update(delta, groundHeight);
    }

    terrainInLane(lane: Lane): Terrain | undefined {
        return this.terrainManager.terrainAt0(lane);
    }

    groundHeight(): number {
        return this.terrainInLane(this.player.lane)?.height() || 0;
    }

    generateNewSegment() {
        const newSegment = segments[Math.floor(Math.random()*segments.length)];

        for(const l of [Lane.Left, Lane.Center, Lane.Right]) {
            let ts = newSegment.terrain[l];
            for(const t of ts) {
                let newT = t.clone();
                newT.offset += this.generatedFrontier;
                this.terrainManager.addTerrain(newT, l);
            }
        }

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
