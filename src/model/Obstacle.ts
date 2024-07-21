import { v4 as uuidv4 } from 'uuid';

export const LOW_OBSTACLE_HEIGHT: number = 1;

export enum ObstacleType {
    Under = 1, // must roll under
    Over = 2, // must jump over
    WagonStart = 1 | 2, // will lose if hit
    Bar = 0, // can both jump over and roll under
};

export default class Obstacle {
    type: ObstacleType;
    uuid: string;
    offset: number; // the position at which this obstacle exists at
    
    constructor(type: ObstacleType, offset: number) {
        this.type = type;
        this.uuid = uuidv4();
        this.offset = offset;
    }

    clone(): Obstacle {
        return new Obstacle(this.type, this.offset);
    }
    
    update(worldOffset: number) {
        this.offset -= worldOffset;
    }
}
