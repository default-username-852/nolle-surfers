import * as THREE from 'three'
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

}
