import { createRoot } from 'react-dom/client';
import * as React from 'react';
import GameView from './view/GameView';
import { Game } from './model/Game';
import { proxy } from 'valtio';
import * as Stats from 'stats.js';

let stats = new Stats();
document.body.appendChild(stats.dom);
requestAnimationFrame(function loop() {
	stats.update();
	requestAnimationFrame(loop);
});

export const gameState = proxy(new Game());

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case "ArrowUp":
            gameState.gesture("up");
            break;
        case "ArrowDown":
            gameState.gesture("down");
            break;
        case "ArrowLeft":
            gameState.gesture("left");
            break;
        case "ArrowRight":
            gameState.gesture("right");
            break;
        default:
            break;
    }
});

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown: number | null = null;
var yDown: number | null = null;

function getTouches(evt: TouchEvent): TouchList {
    return evt.touches;
}

function handleTouchStart(evt: TouchEvent) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt: TouchEvent) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff < 0 ) {
            /* right swipe */
            gameState.gesture("right");
        } else {
            /* left swipe */
            gameState.gesture("left");
        }
    } else {
        if ( yDiff < 0 ) {
            /* down swipe */
            gameState.gesture("down");
        } else {
            /* up swipe */
            gameState.gesture("up");
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

let lastTime = 0;
// delta is in milliseconds
function gameLoop(time: DOMHighResTimeStamp) {
	const delta = time - lastTime;
	gameState.update(delta / 1000);

	lastTime = time;
	window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

let root = document.getElementById('root');
if (root) {
    createRoot(root).render(
        <React.StrictMode>
            <GameView/>
        </React.StrictMode>
    )
}
