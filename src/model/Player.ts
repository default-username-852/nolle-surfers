import { Lane } from './Lane';

const GRAVITY: number = 9.82;

export default class Player {
    height: number = 0;
    velY: number = 0;
    lane: Lane = Lane.Center;
    onGround: boolean = true;
    // TODO: add jump queueing and air jumping

    constructor() {
    }

    update(delta: number, groundHeight: number) {
        this.height += this.velY * delta;
        this.velY -= GRAVITY * delta;

        // runner hit the ground
        if (this.height < groundHeight) {
            this.height = groundHeight;
            this.velY = 0;
            this.onGround = true;
        }
    }

    jump() {
        if (this.onGround) {
            this.velY = 6;
            this.onGround = false;
        }
    }
}
