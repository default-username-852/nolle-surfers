import * as React from "react";
import { laneToOffset } from "../model/Lane";
import { ObjectMap, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { gameState } from "..";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/*
Author: spectrick (https://sketchfab.com/spectrick)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/turtle-animation-a150fca214a64c7787a4e4be780b4737
Title: Turtle-animation
Used with modifications
*/

import Turtle from "./turtle_anim.glb";
import { useSnapshot } from "valtio";
import { RunningState } from "../model/Player";
import { Shadow, ShadowType } from "@react-three/drei";

export default function PlayerView(): React.JSX.Element {
    const meshRef = React.useRef<THREE.Mesh>(null);
    const shadowRef = React.useRef<ShadowType | null>(null);
    const xPos = React.useRef(0);
    const model = useLoader(GLTFLoader, Turtle) as GLTF & ObjectMap;
    const mixer = React.useRef<THREE.AnimationMixer>(new THREE.AnimationMixer(model.scene));
    const running = React.useRef(mixer.current.clipAction(model.animations[2]));
    const rolling = React.useRef(mixer.current.clipAction(model.animations[1]));
    const falling = React.useRef(mixer.current.clipAction(model.animations[0]));

    const player = useSnapshot(gameState).currentInstance.player;

    React.useEffect(() => {
        falling.current.play();
        running.current.play();
        rolling.current.play();
    }, []);

    React.useEffect(() => {
        switch(player.runningState) {
            case RunningState.OnGround:
            case RunningState.AirBuffer:
                if(falling.current.isRunning()) {
                    falling.current.fadeOut(0.5);
                }
                if(rolling.current.isRunning()) {
                    rolling.current.fadeOut(0.2);
                }
                if(!running.current.isRunning()) {
                    running.current.reset().fadeIn(0.1);
                }
                break;
            case RunningState.MidAir:
                if(running.current.isRunning()) {
                    running.current.fadeOut(0.5);
                }
                if(rolling.current.isRunning()) {
                    rolling.current.fadeOut(0.5);
                }
                falling.current.reset().fadeIn(0.1);
                break;
            case RunningState.Rolling:
            case RunningState.AirRoll:
                if(running.current.isRunning()) {
                    running.current.fadeOut(0.2);
                }
                if(falling.current.isRunning()) {
                    falling.current.fadeOut(0.2);
                }
                if(!rolling.current.isRunning()) {
                    rolling.current.reset().fadeIn(0.1);
                }
                break;
        }
    }, [player.runningState]);

    useFrame((s, delta) => {
        const player = gameState.currentInstance.player;
        if (meshRef.current) {
            meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, laneToOffset(player.lane), 10, delta);
            if (shadowRef.current) {
                shadowRef.current.position.x = meshRef.current.position.x;
            }
            xPos.current = meshRef.current.position.x;
            meshRef.current.position.y = player.height;
        }
        mixer.current.update(delta);
    });

    return (<>
        <primitive object={model.scene} ref={meshRef}/>
        <Shadow colorStop={0} position={[0,0.01,0]} ref={shadowRef} opacity={0.6}/>
    </>);
}
