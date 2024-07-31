import * as React from "react";
import { laneToOffset } from "../model/Lane";
import { ObjectMap, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { gameState } from "..";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Turtle from "./turtle_anim.glb";
import { useSnapshot } from "valtio";
import { RunningState } from "../model/Player";

export default function PlayerView(): React.JSX.Element {
    const meshRef = React.useRef<THREE.Mesh>(null);
    const xPos = React.useRef(0);
    const model = useLoader(GLTFLoader, Turtle) as GLTF & ObjectMap;
    const mixer = React.useRef<THREE.AnimationMixer>(new THREE.AnimationMixer(model.scene));
    const running = React.useRef(mixer.current.clipAction(model.animations[1]));
    const falling = React.useRef(mixer.current.clipAction(model.animations[0]));

    const onGround = useSnapshot(gameState).currentInstance.player.onGround;

    React.useEffect(() => {
        falling.current.play();
        running.current.play();
    }, []);

    React.useEffect(() => {
        if (onGround) {
            if (falling.current.isRunning()) {
                falling.current.fadeOut(0.5);
            }
            running.current.reset().fadeIn(0.1);
        } else {
            if (running.current.isRunning()) {
                running.current.fadeOut(0.5);
            }
            falling.current.reset().fadeIn(0.1);
        }
    }, [onGround]);

    useFrame((s, delta) => {
        if (meshRef.current) {
            const player = gameState.currentInstance.player;
            meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, laneToOffset(player.lane), 10, delta);
            xPos.current = meshRef.current.position.x;
            meshRef.current.position.y = player.height;
            if (player.runningState === RunningState.Rolling || player.runningState === RunningState.AirRoll) {
                meshRef.current.scale.y = 0.5;
            } else {
                meshRef.current.scale.y = 1;
            }
        }
        mixer.current.update(delta);
    });

    return (
        <primitive object={model.scene} ref={meshRef}/>
    );
}
