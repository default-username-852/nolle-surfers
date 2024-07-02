import * as THREE from 'three';
import { Lane, laneToOffset } from './Lane';
import MetalTexture from '../../assets/metal.png';

export enum TerrainType {
    Ramp,
    Wagon,
}

/*const ramp = new THREE.Group();

const metalTexture = new THREE.TextureLoader().load(MetalTexture);

metalTexture.wrapS = THREE.RepeatWrapping;
metalTexture.wrapT = THREE.RepeatWrapping;
metalTexture.repeat.set(1,1);

const material = new THREE.MeshStandardMaterial({map: metalTexture, side: THREE.DoubleSide});

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.8, Math.sqrt(10*10+4*4)), material);

plane.rotateX(Math.atan(10/4));

ramp.add(plane);
*/
export class Terrain {
    type: TerrainType;
    offset: number;

    constructor(type: TerrainType, lane: Lane, offset: number) {
        this.type = type;
        this.offset = offset;

        /*switch(type) {
            case TerrainType.Ramp:
                this.mesh = ramp.clone(true);
                break;
            case TerrainType.Wagon:
                const geometry = new THREE.BoxGeometry(1.8,4,10);
                this.mesh = new THREE.Mesh(geometry, material);
                break;
        }*/

        /*this.mesh.position.x = laneToOffset(lane);
        this.mesh.position.y = 2;
        this.mesh.position.z = offset;
        scene.add(this.mesh);*/
    }

    update(delta: number, gameSpeed: number) {
        this.offset -= delta * gameSpeed;
        //this.mesh.position.z = this.offset;
    }

    /// returns the interval of z coordinates that this terrain piece is valid for
    bounds(): [number, number] {
        return [-5 + this.offset, 5 + this.offset];
    }

    /// returns the height of the ground at position 0
    height(): number {
        switch(this.type) {
            case TerrainType.Ramp:
                return (this.offset - 5) * (-4/10)
                break;
            case TerrainType.Wagon:
                return 4;
        }
    }

    remove() {
        //this.mesh.parent?.remove(this.mesh);
        //this.mesh.geometry.dispose();
    }
}
