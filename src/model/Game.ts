import { Terrain, TerrainType } from "./Terrain";
import Player from "./Player";
import { Lane, laneToOffset } from "./Lane";
import * as Deque from "double-ended-queue";

export class Game {
    player: Player;
    terrain: { [key in Lane]: Deque<Terrain> };
    score: number = 0;
    gameSpeed: number = 1;

    constructor () {
        this.player = new Player(0, 1, 0);

        this.terrain = {
            [Lane.Left]: new Deque([
                new Terrain(TerrainType.Wagon, Lane.Left, 10),
            ]),
            [Lane.Center]: new Deque([
                new Terrain(TerrainType.Ramp, Lane.Center, 15),
            ]),
            [Lane.Right]: new Deque([
                new Terrain(TerrainType.Wagon, Lane.Right, 25),
            ]),
        };
    }

    update(delta: number) {
        for(let [_, l] of Object.entries(this.terrain)) {
            for(let t of l.toArray()) { // grr performance perhaps
                t.update(delta, this.gameSpeed);

                if (t.offset <= -11) {
                    l.removeFront();
                }
            }
        }

        this.gameSpeed += delta;

        // calculate ground height
        let nextTerrain = this.terrain[this.player.lane].peekFront();

        let ground = 0;
        if (nextTerrain) {
            let [lower, upper] = nextTerrain.bounds();
            if (lower <= 0 && upper >= 0) {
                ground = nextTerrain.height();
            }
        }

        this.player.update(delta, ground);
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
