import { v4 as uuidv4 } from 'uuid';

// TODO: add more pickup types
export enum PickupType {
    WaterBottle,
    Laptop,
    Pencil,
    Book,
}

export class Pickup {
    type: PickupType;
    height: number;
    offset: number;
    uuid: string;

    constructor(type: PickupType, height: number, offset: number) {
        this.type = type;
        this.height = height;
        this.offset = offset;
        this.uuid = uuidv4();
    }

    update(worldOffset: number) {
        this.offset -= worldOffset;
    }

    clone(): Pickup {
        return new Pickup(this.type, this.height, this.offset);
    }

    points(): number {
        switch (this.type) {
            case PickupType.WaterBottle:
                return 50;
            case PickupType.Pencil:
                return 50;
            case PickupType.Book:
                return 100;
            case PickupType.Laptop:
                return 150;
        }
    }
}
