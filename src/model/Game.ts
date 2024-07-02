import { Terrain, TerrainType } from "./Terrain";
import Player from "./Player";
import { Lane, laneToOffset } from "./Lane";
import * as Deque from "double-ended-queue";
import { segments } from "./Segment";

const INCREASE_SPEED_RATE: number = 0.01;

export class Game {
    player: Player;
    terrain: { [key in Lane]: Deque<Terrain> };
    score: number = 0;
    gameSpeed: number = 1;
    generatedFrontier: number = 10; // represents how many units forward has been generatedequed

    constructor () {
        this.player = new Player(0, 1, 0);

        this.terrain = {
            [Lane.Left]: new Deque([
                //new Terrain(TerrainType.Wagon, 10),
            ]),
            [Lane.Center]: new Deque([
                //new Terrain(TerrainType.Ramp, 15),
            ]),
            [Lane.Right]: new Deque([
                //new Terrain(TerrainType.Wagon, 25),
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

                if (t.offset <= -11) {
                    l.removeFront();
                }
            }
        }

        if(this.generatedFrontier <= 10) {
            this.generateNewSegment();
        }

        // calculate ground height
        const nextTerrain = this.terrain[this.player.lane].peekFront();

        let ground = 0;
        if (nextTerrain) {
            let [lower, upper] = nextTerrain.bounds();
            if (lower <= 0 && upper >= 0) {
                ground = nextTerrain.height();
            }
        }

        this.player.update(delta, ground);
    }

    generateNewSegment() {
        const newSegment = segments[Math.floor(Math.random()*segments.length)];

        for(const l of [Lane.Left, Lane.Center, Lane.Right]) {
            let ts = newSegment.terrain[l];
            for(const t of ts) {
                let newT = t.clone();
                newT.offset += this.generatedFrontier;
                this.terrain[l].insertBack(newT);
            }
        }

        this.generatedFrontier += newSegment.length;
    }

	keyboardEvent(event: KeyboardEvent) {
        switch (event.code) {
            case "ArrowUp":
                this.player.jump();
                break;
            default:
                break;
        }
	}
}
