import { Lane } from "./Lane";
import Obstacle, { ObstacleType } from "./Obstacle";
import { Pickup, PickupType } from "./Pickup";
import { Terrain, TerrainType } from "./Terrain";

/**
 * Represents a segment of the world, that can be added into the game world
 */
export class Segment {
    terrain: { [key in Lane]: Terrain[] };
    obstacle: { [key in Lane]: Obstacle[] };
    pickups: { [key in Lane]: Pickup[] };
    length: number;

    constructor(
        terrains: [Terrain[],Terrain[],Terrain[]],
        obstacles: [Obstacle[],Obstacle[],Obstacle[]],
        pickups: [Pickup[], Pickup[], Pickup[]],
        length: number
    ) {
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
        this.pickups = {
            [Lane.Left]: pickups[0],
            [Lane.Center]: pickups[1],
            [Lane.Right]: pickups[2],
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
        [[new Obstacle(ObstacleType.Under, 75)], [new Obstacle(ObstacleType.Over,40)], []], [[new Pickup(PickupType.Pencil, 5, 11)], [new Pickup(PickupType.Laptop, 1, 45)], [new Pickup(PickupType.WaterBottle, 1, 10)]], 80),
    
     new Segment(
        [[
            new Terrain(TerrainType.Wagon, 0), new Terrain(TerrainType.Wagon, 20), 
        ], [
            new Terrain(TerrainType.Wagon, 0), 
        ], [
            new Terrain(TerrainType.Ramp, 10), new Terrain(TerrainType.Wagon, 20), 
        ]],
        [[], [new Obstacle(ObstacleType.Bar, 20), new Obstacle(ObstacleType.Bar, 30)], []], [[new Pickup(PickupType.Book, 5, 10)], [], [new Pickup(PickupType.WaterBottle, 5, 20)]], 40),
    
    new Segment(
        [[
            
        ], [
            new Terrain(TerrainType.Wagon, 5), new Terrain(TerrainType.Wagon, 15)
        ], [
            new Terrain(TerrainType.Ramp, 5), new Terrain(TerrainType.Wagon, 15), new Terrain(TerrainType.Wagon, 25)
        ]],
        [[new Obstacle(ObstacleType.Under, 10),new Obstacle(ObstacleType.Over, 20)], [], []], [[new Pickup(PickupType.Laptop, 1, 12),new Pickup(PickupType.Book, 1,25)], [], [new Pickup(PickupType.WaterBottle, 5, 18)]], 40),
    

    new Segment(
        [[new Terrain(TerrainType.Wagon, 5)], [ ], []],
        [[new Obstacle(ObstacleType.Bar, 15),new Obstacle(ObstacleType.Bar, 30)], [new Obstacle(ObstacleType.Over, 10), new Obstacle(ObstacleType.Bar, 20), new Obstacle(ObstacleType.Over, 30)], [new Obstacle(ObstacleType.Over, 15)]], 
        [[new Pickup(PickupType.Pencil, 1, 1),new Pickup(PickupType.WaterBottle, 1,35)], [], [new Pickup(PickupType.WaterBottle, 1, 25)]], 45),
    
    new Segment(
        [[ ], [ new Terrain(TerrainType.Wagon, 30)
        ], [
            new Terrain(TerrainType.Ramp, 5),new Terrain(TerrainType.Wagon, 15),new Terrain(TerrainType.Wagon, 25)]],
        [[new Obstacle(ObstacleType.Bar, 10)], [new Obstacle(ObstacleType.Over, 20)], []], 
        
        [[new Pickup(PickupType.Book, 1,20)],[new Pickup(PickupType.Laptop, 1,5)], [new Pickup(PickupType.WaterBottle, 5,20), new Pickup(PickupType.Pencil, 5,28)]], 40),
    
    new Segment(
        [[ ], [   ], [new Terrain(TerrainType.Ramp, 5),new Terrain(TerrainType.Wagon, 15)]],
        [[new Obstacle(ObstacleType.Under, 10)], [new Obstacle(ObstacleType.Over, 10),new Obstacle(ObstacleType.Bar, 20)], []],  
        [[new Pickup(PickupType.Laptop, 1, 5),new Pickup(PickupType.Book, 1, 20)],[new Pickup(PickupType.WaterBottle, 1, 18)], [new Pickup(PickupType.WaterBottle, 5, 20)]], 35),
    
        //new Segment(
    //    [[],[],[]],
    //    [[
    //        new Obstacle(ObstacleType.Bar, 20)
    //    ], [
    //        new Obstacle(ObstacleType.Over, 20)
    //    ], [
    //        new Obstacle(ObstacleType.Under, 20)
    //    ]], [[], [], []],
    //    40
    //),
    //new Segment(
    //    [[], [], []], [[], [], []],
    //    [
    //        [new Pickup(PickupType.Pencil, 1, 10)], 
    //        [new Pickup(PickupType.WaterBottle, 1, 10), new Pickup(PickupType.Laptop, 1, 30)], 
    //        [new Pickup(PickupType.Book, 1, 10)]
    //    ],
    //    40
    //)
];
