import { Lane } from "./Lane";
import { Terrain, TerrainType } from "./Terrain";
import { proxy, ref } from "valtio";
import Obstacle, { ObstacleType } from "./Obstacle";
import { PriorityQueue } from "@datastructures-js/priority-queue";

interface IHasOffset {
    offset: number
}

function compareHasOffset<T extends IHasOffset>(a: T, b: T): number {
    return a.offset - b.offset;
}

export class TerrainManager {
    terrain: { [key in Lane]: PriorityQueue<Terrain> }; // invariant: each deque is non-decreasing w.r.t. the offset value
    terrainIdMap: { [key: string]: Terrain } = {};
    obstacle: { [key in Lane]: PriorityQueue<Obstacle> }; // invariant: each deque is non-decreasing w.r.t. the offset value
    obstacleIdMap: { [key: string]: Obstacle } = {};
    didChange: number = 0; // hack to allow reactive updates. will change whenever a terrain or obstacle is added

    terrains(lane: Lane): Terrain[] {
        return this.terrain[lane].toArray();
    }
    
    obstacles(lane: Lane): Obstacle[] {
        return this.obstacle[lane].toArray();
    }
    
    constructor() {
        this.terrain = {
            [Lane.Left]: ref(new PriorityQueue(compareHasOffset)),
            [Lane.Center]: ref(new PriorityQueue(compareHasOffset)),
            [Lane.Right]: ref(new PriorityQueue(compareHasOffset)),
        };
        this.obstacle = {
            [Lane.Left]: ref(new PriorityQueue(compareHasOffset)),
            [Lane.Center]: ref(new PriorityQueue(compareHasOffset)),
            [Lane.Right]: ref(new PriorityQueue(compareHasOffset)),
        }
    }
    
    thisDidChange() {
        this.didChange = Math.random();
    }

    update(worldOffset: number) {
        for(const [_, l] of Object.entries(this.terrain)) {
            for(const t of l.toArray()) {
                t.update(worldOffset);
            }

            while(true) {
                const front = l.front();
                if (!front || front.bounds()[1] > -5) {
                    break;
                }
                const removed = l.pop();
                if (removed) {
                    delete this.terrainIdMap[removed?.uuid];
                    this.thisDidChange();
                }
            }
        }
        
        for(const [_, l] of Object.entries(this.obstacle)) {
            for(const o of l.toArray()) {
                o.update(worldOffset);
            }

            while(true) {
                const front = l.front();
                if (!front || front.offset > -5) {
                    break;
                }
                const removed = l.pop();
                if (removed) {
                    delete this.obstacleIdMap[removed?.uuid];
                    this.thisDidChange();
                }
            }
        }
    }

    terrainAt0(lane: Lane): Terrain | undefined {
        const terrainInLane = this.terrain[lane];
        for(const terrain of terrainInLane.toArray()) {
            const [lower, upper] = terrain.bounds();
            if (lower <= 0 && upper >= 0) {
                return terrain;
            } else if (lower > 0) { // still haven't reached this obstacle
                break;
            }
        }

        return undefined;
    }
    
    nextObstacle(lane: Lane): Obstacle | undefined {
        const obstacleInLane = this.obstacle[lane];
        for(const obstacle of obstacleInLane.toArray()) {
            const pos = obstacle.offset;
            if (pos > 0) {
                return obstacle;
            }
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
        if(terrain.type === TerrainType.Wagon) { // a wagon has an implied lose at the start of the entity
            this.addObstacle(new Obstacle(ObstacleType.WagonStart, terrain.offset), lane);
        }
        
        const p = proxy(terrain);
        
        this.terrainIdMap[terrain.uuid] = p;

        this.terrain[lane].push(p);
    }
    
    addObstacle(obstacle: Obstacle, lane: Lane) {
        const p = proxy(obstacle);
        
        this.obstacleIdMap[obstacle.uuid] = obstacle;
        
        this.obstacle[lane].push(p);
    }
}
