import { Lane } from "./Lane";
import { Terrain, TerrainType } from "./Terrain";
import { proxy, ref } from "valtio";
import Obstacle, { ObstacleType } from "./Obstacle";
import { PriorityQueue } from "@datastructures-js/priority-queue";
import { Pickup } from "./Pickup";

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
    pickup: { [key in Lane]: PriorityQueue<Pickup> };
    pickupIdMap: { [key: string]: Pickup } = {};
    didChange: number = 0; // hack to allow reactive updates. will change whenever a terrain or obstacle is added

    terrains(lane: Lane): Terrain[] {
        return this.terrain[lane].toArray();
    }

    obstacles(lane: Lane): Obstacle[] {
        return this.obstacle[lane].toArray();
    }

    pickups(lane: Lane): Pickup[] {
        return this.pickup[lane].toArray();
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
        };
        this.pickup = {
            [Lane.Left]: ref(new PriorityQueue(compareHasOffset)),
            [Lane.Center]: ref(new PriorityQueue(compareHasOffset)),
            [Lane.Right]: ref(new PriorityQueue(compareHasOffset)),
        };
    }

    thisDidChange() {
        this.didChange = Math.random();
    }

    update(worldOffset: number) {
        interface Updateable {
            uuid: string;
            update: (worldOffset: number) => void;
        };

        function $update<T extends Updateable>(
            self: TerrainManager,
            idMap: { [key: string]: T },
            byLane: { [key in Lane]: PriorityQueue<T> },
            doBreak: (e: T) => boolean
        ) {
            for(const lane of [Lane.Left, Lane.Center, Lane.Right]) {
                const l = byLane[lane];
                for(const t of l.toArray()) {
                    t.update(worldOffset);
                }

                while(true) {
                    const front = l.front();
                    if (!front || doBreak(front)) {
                        break;
                    }
                    const removed = l.pop();
                    if (removed) {
                        delete idMap[removed?.uuid];
                        self.thisDidChange();
                    }
                }
            }
        }

        $update(this, this.terrainIdMap, this.terrain, (e: Terrain) => e.bounds()[1] > -5);
        $update(this, this.obstacleIdMap, this.obstacle, (e: Obstacle) => e.offset > -5);
        $update(this, this.pickupIdMap, this.pickup, (e: Pickup) => e.offset > -5);
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

    pickupById(id: string) {
        return this.pickupIdMap[id];
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

        this.obstacleIdMap[obstacle.uuid] = p;

        this.obstacle[lane].push(p);
    }

    addPickup(pickup: Pickup, lane: Lane) {
        const p = proxy(pickup);

        this.pickupIdMap[pickup.uuid] = p;

        this.pickup[lane].push(p);
    }
}
