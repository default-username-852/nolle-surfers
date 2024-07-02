import { createRoot } from 'react-dom/client';
import * as React from 'react';
import GameView from './view/GameView';
import { Game } from './model/Game';
import { proxy } from 'valtio';
import * as Stats from 'stats.js';

// TODO: add support for swipe gestures

let stats = new Stats();
document.body.appendChild(stats.dom);
requestAnimationFrame(function loop() {
	stats.update();
	requestAnimationFrame(loop);
});

const game = proxy(new Game());

let root = document.getElementById('root');
document.addEventListener('keydown', (event) => {
    game.keyboardEvent(event as KeyboardEvent);
});

let lastTime = 0;
// delta is in milliseconds
function gameLoop(time: DOMHighResTimeStamp) {
	const delta = time - lastTime;
	game.update(delta / 1000);

	lastTime = time;
	window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

if (root) {
    createRoot(root).render(
        <React.StrictMode>
            <GameView game={game}/>
        </React.StrictMode>
    )
}
