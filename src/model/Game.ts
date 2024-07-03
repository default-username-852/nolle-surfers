import { Terrain, TerrainType } from "./Terrain";
import Player from "./Player";
import { Lane, laneToOffset } from "./Lane";
import * as Deque from "double-ended-queue";
import { segments } from "./Segment";
import { proxy } from "valtio";

const INCREASE_SPEED_RATE: number = 0.01;

export class Game {
    player: Player;
    terrain: { [key in Lane]: Deque<Terrain> }; // invariant: each deque is non-decreasing w.r.t. the offset value
    score: number = 0;
    gameSpeed: number = 2.5;
    generatedFrontier: number = 10; // represents how many units forward has been generatedequed

    constructor () {
        this.player = new Player();

        this.terrain = {
            [Lane.Left]: new Deque([
            ]),
            [Lane.Center]: new Deque([
            ]),
            [Lane.Right]: new Deque([
            ]),
        };
    }

    update(delta: number) {
        this.gameSpeed += delta * INCREASE_SPEED_RATE;

        const worldOffset = this.gameSpeed * delta;

        this.generatedFrontier -= worldOffset;

        for(const [_, l] of Object.entries(this.terrain)) {
            for(const t of l.toArray()) { // grr performance perhaps
                t.update(worldOffset);
            }

            while(true) {
                const front = l.peekFront();
                if (!front || front.offset > -11) {
                    break;
                }
                l.removeFront();
            }
        }

        if(this.generatedFrontier <= 100) {
            this.generateNewSegment();
        }

        let groundHeight = this.groundHeight();

        this.player.update(delta, groundHeight);
    }

    terrainInLane(lane: Lane): Terrain | undefined {
        const terrainInLane = this.terrain[lane];
        let idx = 0;
        while(true) {
            const obstacle = terrainInLane.get(idx);
            if (!obstacle) {
                break;
            }

            const [lower, upper] = obstacle.bounds();
            if (lower <= 0 && upper >= 0) {
                return obstacle;
            } else if (lower > 0) { // still haven't reached this obstacle
                break;
            }

            idx++;
        }

        return undefined;
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
                this.terrain[l].insertBack(proxy(newT));
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
