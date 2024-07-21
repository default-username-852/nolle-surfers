import { Lane } from "./Lane";
import * as Deque from "double-ended-queue";
import { Terrain } from "./Terrain";
import { proxy } from "valtio";
import Obstacle from "./Obstacle";

export class TerrainManager {
    terrain: { [key in Lane]: Deque<Terrain> }; // invariant: each deque is non-decreasing w.r.t. the offset value
    terrainIdMap: { [key: string]: Terrain } = {};
    obstacle: { [key in Lane]: Deque<Obstacle> }; // invariant: each deque is non-decreasing w.r.t. the offset value
    obstacleIdMap: { [key: string]: Obstacle } = {};

    terrains(lane: Lane): Terrain[] {
        return this.terrain[lane].toArray();
    }
    
    obstacles(lane: Lane): Obstacle[] {
        return this.obstacle[lane].toArray();
    }
    
    constructor() {
        this.terrain = {
            [Lane.Left]: new Deque(),
            [Lane.Center]: new Deque(),
            [Lane.Right]: new Deque(),
        };
        this.obstacle = {
            [Lane.Left]: new Deque(),
            [Lane.Center]: new Deque(),
            [Lane.Right]: new Deque(),
        }
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
                    delete this.terrainIdMap[removed?.uuid];
                }
            }
        }
        
        for(const [_, l] of Object.entries(this.obstacle)) {
            for(const o of l.toArray()) { // grr performance perhaps
                o.update(worldOffset);
            }

            while(true) {
                const front = l.peekFront();
                if (!front || front.offset > -5) {
                    break;
                }
                const removed = l.removeFront();
                if (removed) {
                    delete this.obstacleIdMap[removed?.uuid];
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
        return this.terrainIdMap[id];
    }
    
    obstacleById(id: string): Obstacle | undefined {
        return this.obstacleIdMap[id];
    }

    addTerrain(terrain: Terrain, lane: Lane) {
        const p = proxy(terrain);
        
        this.terrainIdMap[terrain.uuid] = p;

        // TODO: check that invariant is maintained
        this.terrain[lane].insertBack(p);
    }
    
    addObstacle(obstacle: Obstacle, lane: Lane) {
        const p = proxy(obstacle);
        
        this.obstacleIdMap[obstacle.uuid] = obstacle;
        
        this.obstacle[lane].insertBack(p);
    }
}
