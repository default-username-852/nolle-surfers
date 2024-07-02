/*import * as THREE from 'three'
import Player from './Player';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import Game from './Game';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const game = new Game(scene);

//const ambientLight = new THREE.AmbientLight();
//ambientLight.intensity = 0.5;
//scene.add(ambientLight);

const sun = new THREE.HemisphereLight(0xffffff, 0x000000);
sun.intensity = 2;
scene.add(sun);

camera.position.y = 4;
camera.position.z = -3;

camera.lookAt(0,0,5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.getElementById("root")?.appendChild( renderer.domElement );

const clock = new THREE.Clock();

window.addEventListener('resize', onWindowResize);
document.addEventListener('keydown', (event) => {
	game.keyboardEvent(event as KeyboardEvent);
});

function onWindowResize() {
	const SCREEN_HEIGHT = window.innerHeight;
	const SCREEN_WIDTH = window.innerWidth;

	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
}

function animate() {
	const delta = clock.getDelta();

	game.update(delta);

	renderer.render( scene, camera );

}*/

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
