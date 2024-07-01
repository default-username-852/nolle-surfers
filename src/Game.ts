import { Terrain, TerrainType } from "./Terrain";
import Player from "./Player";
import * as THREE from "three";
import { Lane, laneToOffset } from "./Lane";
import GravelTexture from "../assets/gravel.png";
import * as Deque from "double-ended-queue";

export default class Game {
    player: Player;
    terrain: { [key in Lane]: Deque<Terrain> };
    lanes: THREE.Mesh[];

    constructor (scene: THREE.Scene) {
        this.player = new Player(scene, 0, 1, 0);
        this.lanes = [];
        const grassTexture = new THREE.TextureLoader().load(GravelTexture);

        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(1,15);

        for(let lane of [Lane.Left, Lane.Center, Lane.Right]) {
            const geometry = new THREE.PlaneGeometry(2, 30);
            const material = new THREE.MeshStandardMaterial({side: THREE.DoubleSide, map:grassTexture});
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = laneToOffset(lane);
            mesh.position.z = 12;
            mesh.rotateX(Math.PI / 2);
            scene.add(mesh);
            this.lanes.push(mesh);
        }

        this.terrain = {
            [Lane.Left]: new Deque([
                new Terrain(scene, TerrainType.Wagon, Lane.Left, 10),
            ]),
            [Lane.Center]: new Deque([
                new Terrain(scene, TerrainType.Wagon, Lane.Center, 15),
            ]),
            [Lane.Right]: new Deque([
                new Terrain(scene, TerrainType.Wagon, Lane.Right, 25),
            ]),
        };
    }

    update(delta: number) {
        for(let [_, l] of Object.entries(this.terrain)) {
            for(let t of l.toArray()) { // grr performance perhaps
                t.update(delta);

                if (t.offset <= 1) {
                    l.removeFront()?.remove();
                }
            }
        }

        // calculate ground height
        let nextTerrain = this.terrain[this.player.lane].peekFront();

        let ground = 0;
        if (nextTerrain) {
            let [lower, upper] = nextTerrain.bounds();
            if (lower <= 0 && upper >= 0) {
                ground = nextTerrain.height();
            }
        }

        this.player.update(delta, ground);

    }

	keyboardEvent(event: KeyboardEvent) {
        switch (event.code) {
            case "ArrowUp":
                this.player.jump();
                break;
            default:
                break;
        }
	}
}
