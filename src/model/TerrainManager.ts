import { Lane } from "./Lane";
import * as Deque from "double-ended-queue";
import { Terrain } from "./Terrain";
import { proxy } from "valtio";

export class TerrainManager {
    terrain: { [key in Lane]: Deque<Terrain> }; // invariant: each deque is non-decreasing w.r.t. the offset value
    idMap: { [key: string]: Terrain } = {};

    constructor() {
        this.terrain = {
            [Lane.Left]: new Deque([
            ]),
            [Lane.Center]: new Deque([
            ]),
            [Lane.Right]: new Deque([
            ]),
        };
    }

    update(worldOffset: number) {
        for(const [_, l] of Object.entries(this.terrain)) {
            for(const t of l.toArray()) { // grr performance perhaps
                t.update(worldOffset);
            }

            while(true) {
                const front = l.peekFront();
                if (!front || front.bounds()[1] > -5) {
                    break;
                }
                const removed = l.removeFront();
                if (removed) {
                    delete this.idMap[removed?.uuid];
                }
            }
        }
    }

    terrainAt0(lane: Lane): Terrain | undefined {
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

    terrainById(id: string): Terrain | undefined {
        return this.idMap[id];
    }

    addTerrain(terrain: Terrain, lane: Lane) {
        this.idMap[terrain.uuid] = terrain;

        // TODO: check that invariant is maintained
        this.terrain[lane].insertBack(proxy(terrain));
    }
}
