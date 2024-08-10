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

function curryTerrain(type: TerrainType): (offset: number) => Terrain {
    return (offset) => new Terrain(type, offset);
}

const ramp = curryTerrain(TerrainType.Ramp);
const wagon = curryTerrain(TerrainType.Wagon);

function curryObstacle(type: ObstacleType): (offset: number) => Obstacle {
    return (offset) => new Obstacle(type, offset);
}

const bar = curryObstacle(ObstacleType.Bar);
const under = curryObstacle(ObstacleType.Under);
const over = curryObstacle(ObstacleType.Over);

function curryPickup(type: PickupType): (height: number, offset: number) => Pickup {
    return (h, o) => new Pickup(type, h, o);
}

const laptop = curryPickup(PickupType.Laptop);
const book = curryPickup(PickupType.Book);
const pencil = curryPickup(PickupType.Pencil);
const waterBottle = curryPickup(PickupType.WaterBottle);

// maybe load from json
export const SEGMENTS = [
    new Segment(
        [[
            wagon(0), wagon(20), wagon(40)
        ], [
            ramp(0), wagon(10)
        ], [
            wagon(15), wagon(35), wagon(55)
        ]],
        [[under(75)], [over(40)], []], [[pencil(5, 11)], [laptop(1, 45)], [waterBottle(1, 10)]], 80),

     new Segment(
        [[
            wagon(0), wagon(20),
        ], [
            wagon(0),
        ], [
            ramp(10), wagon(20),
        ]],
        [[], [bar(20), bar(30)], []], [[book(5, 10)], [], [waterBottle(5, 20)]], 40),

    new Segment(
        [[

        ], [
            wagon(5), wagon(25)
        ], [
            ramp(5), wagon(15)
        ]],
        [[under(10),over(20)], [], []], [[laptop(1, 12),book(1, 25)], [], [waterBottle(5, 18)]], 45),


    new Segment(
        [[wagon(5)], [ ], []],
        [[bar(15),bar(30)], [over(10), bar(20), over(30)], [over(15)]],
        [[pencil(1, 1),waterBottle(1, 35)], [], [waterBottle(1, 25)]], 45),

    new Segment(
        [[ ], [ wagon(30)
        ], [
            ramp(5),wagon(15)]],
        [[bar(10)], [over(20)], []],

        [[book(1, 20)],[laptop(1, 5)], [waterBottle(5, 20), pencil(5, 28)]], 50),

    new Segment(
        [[ ], [   ], [ramp(5),wagon(15)]],
        [[under(10)], [over(10),bar(20)], []],
        [[laptop(1, 5),book(1, 20)],[waterBottle(1, 18)], [waterBottle(5, 20)]], 35),
    new Segment([
            [wagon(0), wagon(45)],
            [ramp(5), wagon(15), wagon(35)],
            [wagon(0), wagon(45)]
        ],
        [[over(30)],[],[under(25)]],
        [[],[laptop(1, 60)],[]],
        65
    ),
    new Segment(
        [[],[],[]],
        [[under(10), over(25)],[bar(10), over(25)],[]],
        [[],[pencil(3,10)],[]],
        30
    ),
];
