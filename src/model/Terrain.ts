import { v4 as uuidv4 } from 'uuid';

export enum TerrainType {
    Ramp,
    Wagon,
}

export class Terrain {
    type: TerrainType;
    offset: number; // terrain starts at offset
    uuid: string;

    constructor(type: TerrainType, offset: number) {
        this.type = type;
        this.offset = offset;
        this.uuid = uuidv4();
    }

    update(worldOffset: number) {
        this.offset -= worldOffset;
    }

    /// returns the interval of z coordinates that this terrain piece is valid for
    bounds(): [number, number] {
        return [this.offset, this.offset + 10];
    }

    /// returns the height of the ground at position 0
    height(): number {
        switch(this.type) {
            case TerrainType.Ramp:
                return (this.offset) * (-4/10)
            case TerrainType.Wagon:
                return 4;
        }
    }

    clone(): Terrain {
        return new Terrain(this.type, this.offset);
    }
}
