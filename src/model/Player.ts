import { Lane } from './Lane';

export default class Player {
    height: number;
    velY: number;
    lane: Lane;

    constructor(x: number, y: number, z: number) {
        this.height = 0;
        this.velY = 0;
        this.lane = Lane.Center;
    }

    update(delta: number, groundHeight: number) {
        this.height += this.velY * delta;
        this.velY -= 4 * delta;

        // runner hit the ground
        if (this.height < groundHeight) {
            this.height = groundHeight;
            this.velY = 0;
        }
    }

    jump() {
        this.velY = 4;
    }
}
