import * as Deque from "double-ended-queue";
import { Lane } from "./Lane";
import { Terrain, TerrainType } from "./Terrain";

/**
 * Represents a segment of the world, that can be added into the game world
 */
export class Segment {
    terrain: { [key in Lane]: Terrain[] };
    length: number;

    constructor(lefts: Terrain[], centers: Terrain[], rights: Terrain[],  length: number) {
        this.terrain = {
            [Lane.Left]: lefts,
            [Lane.Center]: centers,
            [Lane.Right]: rights,
        };
        this.length = length;
    }
}

// TODO: add more segments
export const segments = [
    new Segment([
        new Terrain(TerrainType.Wagon, 0), new Terrain(TerrainType.Wagon, 10), new Terrain(TerrainType.Wagon, 25)
    ], [
        new Terrain(TerrainType.Ramp, 0), new Terrain(TerrainType.Wagon, 10)
    ], [
        new Terrain(TerrainType.Wagon, 15), new Terrain(TerrainType.Wagon, 25), new Terrain(TerrainType.Wagon, 35)
    ], 50),
];
