import * as React from "react";
import * as THREE from "three";
import MetalTexture from "../../../assets/metal.png";
import { Lane, laneToOffset } from "../../model/Lane";
import { useFrame } from "@react-three/fiber";
import { gameState } from "../..";
import { ObstacleType } from "../../model/Obstacle";
import { Shadow } from "@react-three/drei";
import { ConcreteBlock } from "./ConcreteBlock";
import { RoadBarrier } from "./RoadBarrier";
import { RoadBlock } from "./RoadBlock";

const metalTexture = new THREE.TextureLoader().load(MetalTexture);

metalTexture.wrapS = THREE.RepeatWrapping;
metalTexture.wrapT = THREE.RepeatWrapping;
metalTexture.repeat.set(1,1);

export const ObstacleView = function ({lane, obstacleId}: {lane: Lane, obstacleId: string}): React.JSX.Element {
    const meshRef = React.useRef<THREE.Group>(null);
    const obstacle = gameState.currentInstance.terrainManager.obstacleById(obstacleId);

    if(!obstacle) {
        console.error("invalid terrain ID: "+obstacleId);
        return <></>;
    }

    useFrame((s, delta) => {
        if(meshRef.current) {
            meshRef.current.position.z = obstacle.offset;
            meshRef.current.visible = obstacle.offset <= 40;
        }
    });

    let mesh;

    switch(obstacle.type) {
        case ObstacleType.Under:
            mesh = <RoadBlock rotation={[0,Math.PI / 2,0]} position={[laneToOffset(lane), 1.5, 0]} scale={[1,1.5,1.2]}/>;
            break;
        case ObstacleType.Over:
            mesh = <ConcreteBlock rotation={[0,Math.PI / 2,0]} position={[laneToOffset(lane), 0.5, 0]}/>;
            break;
        case ObstacleType.WagonStart:
            mesh = <></>;
            break;
        case ObstacleType.Bar:
            mesh = <RoadBarrier rotation={[0,0,0]} position={[laneToOffset(lane), 0, 0]}/>;
            break;
    }

    return <group ref={meshRef}>
        {mesh}
        {obstacle.type === ObstacleType.WagonStart ? <></> : <Shadow position={[laneToOffset(lane), 0.01, 0]} scale={[2.7,1,0.8]}/>}
    </group>
};
