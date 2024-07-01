import * as THREE from 'three';
import { Lane } from './Lane';

export default class Player {
    height: number;
    velY: number;
    lane: Lane;

    mesh: THREE.Mesh;

    constructor(scene: THREE.Scene, x: number, y: number, z: number) {
        this.height = 0;
        this.velY = 0;
        this.lane = Lane.Center;

        const geometry = new THREE.BoxGeometry(1,2,1);
        const material = new THREE.MeshStandardMaterial({color: 0xff0000});

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
        scene.add(this.mesh);
    }

    update(delta: number, groundHeight: number) {
        this.height += this.velY * delta;
        this.velY -= 4 * delta;

        // runner hit the ground
        if (this.height < groundHeight) {
            this.height = groundHeight;
            this.velY = 0;
        }

        this.mesh.position.y = this.height + 1;
    }

    jump() {
        this.velY = 4;
    }
}
