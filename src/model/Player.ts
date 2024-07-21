import { Lane } from './Lane';

const GRAVITY: number = 9.82;
const JUMP_QUEUE_TIME: number = 0.5; // seconds
const AIR_RUN_TIME: number = 0.25; // seconds

export enum RunningState {
    OnGround,
    AirBuffer,
    MidAir,
}

export default class Player {
    height: number = 0;
    velY: number = 0;
    lane: Lane = Lane.Center;
    runningState: RunningState = RunningState.OnGround;
    queuedJump: number = 0; // the number of seconds until a queued jump is discarded
    airRunTime: number = 0; // the number of seconds until the fake ground is considered to have run out

    constructor() {}

    get onGround() {
        return this.runningState === RunningState.OnGround || this.runningState === RunningState.AirBuffer;
    }
    
    update(delta: number, groundHeight: number) {
        switch (this.runningState) {
            case RunningState.OnGround:
                if (this.velY > 0) {
                    this.runningState = RunningState.MidAir;
                    this.height += this.velY * delta;
                } else if (groundHeight < this.height) { // ground just dissapeared
                    this.runningState = RunningState.AirBuffer;
                    this.airRunTime = AIR_RUN_TIME;
                } else if (groundHeight > this.height) {
                    // ground moved up, snap to it
                    this.height = groundHeight
                }
            break;
            case RunningState.AirBuffer:
                if (this.airRunTime <= 0) {
                    if (this.height <= groundHeight) {
                        this.runningState = RunningState.OnGround;
                        this.velY = 0;
                    } else {
                        this.runningState = RunningState.MidAir;
                    }
                }
            break;
            case RunningState.MidAir:
                this.height += this.velY * delta;
                this.velY -= GRAVITY * delta;
                
                if (this.height <= groundHeight) {
                    this.height = groundHeight;
                    this.runningState = RunningState.OnGround;
                    this.velY = 0;
                }
            break;
        }

        if (this.queuedJump > 0 && this.onGround) {
            this.queuedJump = 0;
            this.jump();
        }

        this.queuedJump = Math.max(this.queuedJump - delta, 0);
        this.airRunTime = Math.max(this.airRunTime - delta, 0);
    }

    jump() {
        if (this.onGround) {
            this.velY = 6;
            this.airRunTime = 0;
        } else {
            this.queuedJump = JUMP_QUEUE_TIME;
        }
    }
}
