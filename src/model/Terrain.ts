import { Lane } from './Lane';

export enum TerrainType {
    Ramp,
    Wagon,
}

export class Terrain {
    type: TerrainType;
    offset: number;

    constructor(type: TerrainType, lane: Lane, offset: number) {
        this.type = type;
        this.offset = offset;
    }

    update(delta: number, gameSpeed: number) {
        this.offset -= delta * gameSpeed;
    }

    /// returns the interval of z coordinates that this terrain piece is valid for
    bounds(): [number, number] {
        return [-5 + this.offset, 5 + this.offset];
    }

    /// returns the height of the ground at position 0
    height(): number {
        switch(this.type) {
            case TerrainType.Ramp:
                return (this.offset - 5) * (-4/10)
                break;
            case TerrainType.Wagon:
                return 4;
        }
    }
}
