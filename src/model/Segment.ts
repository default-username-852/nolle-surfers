import { Lane } from "./Lane";
import Obstacle, { ObstacleType } from "./Obstacle";
import { Terrain, TerrainType } from "./Terrain";

/**
 * Represents a segment of the world, that can be added into the game world
 */
export class Segment {
    terrain: { [key in Lane]: Terrain[] };
    obstacle: { [key in Lane]: Obstacle[] };
    length: number;

    constructor(terrains: [Terrain[],Terrain[],Terrain[]], obstacles: [Obstacle[],Obstacle[],Obstacle[]], length: number) {
        this.terrain = {
            [Lane.Left]: terrains[0],
            [Lane.Center]: terrains[1],
            [Lane.Right]: terrains[2],
        };
        this.obstacle = {
            [Lane.Left]: obstacles[0],
            [Lane.Center]: obstacles[1],
            [Lane.Right]: obstacles[2],
        };
        this.length = length;
    }
}

// TODO: add more segments
// maybe load from json
export const SEGMENTS = [
    new Segment(
        [[
            new Terrain(TerrainType.Wagon, 0), new Terrain(TerrainType.Wagon, 20), new Terrain(TerrainType.Wagon, 40)
        ], [
            new Terrain(TerrainType.Ramp, 0), new Terrain(TerrainType.Wagon, 10)
        ], [
            new Terrain(TerrainType.Wagon, 15), new Terrain(TerrainType.Wagon, 35), new Terrain(TerrainType.Wagon, 55)
        ]], 
        [[], [], []], 80),
    new Segment(
        [[],[],[]],
        [[
            new Obstacle(ObstacleType.Bar, 20)
        ], [
            new Obstacle(ObstacleType.Over, 20)
        ], [
            new Obstacle(ObstacleType.Under, 20)
        ]],
        50
    )
];
