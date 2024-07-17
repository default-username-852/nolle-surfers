import Player from "../model/Player";
import * as React from "react";
import { laneToOffset } from "../model/Lane";
import { ObjectMap, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { gameState } from "..";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Turtle from "./turtle_anim.glb";

export default function PlayerView(): React.JSX.Element {
    const meshRef = React.useRef<THREE.Mesh>(null);
    const xPos = React.useRef(0);
    const model = useLoader(GLTFLoader, Turtle) as GLTF & ObjectMap;
    console.log(model.animations);
    const mixer = React.useRef<THREE.AnimationMixer>(new THREE.AnimationMixer(model.scene));
    mixer.current.clipAction(model.animations[1]).play();
    
    useFrame((s, delta) => {
        if (meshRef.current) {
            const player = gameState.currentInstance.player;
            meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, laneToOffset(player.lane), 10, delta);
            xPos.current = meshRef.current.position.x;
            meshRef.current.position.y = player.height;
        }
        mixer.current.update(delta);
    });

    return (
        <>
            <primitive object={model.scene} ref={meshRef}/>
        </>
    );
}
