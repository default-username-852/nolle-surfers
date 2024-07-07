

export enum Lane {
    Left,
    Center,
    Right,
}

export function laneToOffset(lane: Lane): number {
    switch(lane) {
        case Lane.Left:
            return 3;
        case Lane.Center:
            return 0;
        case Lane.Right:
            return -3;
    }
}
