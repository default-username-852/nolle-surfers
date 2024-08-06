import * as React from "react";
import { Terrain, TerrainType } from "../model/Terrain";
import * as THREE from "three";
import MetalTexture from "../../assets/metal.png";
import { Lane, laneToOffset } from "../model/Lane";
import { GroupProps, useFrame } from "@react-three/fiber";
import { gameState } from "..";
import { ObstacleType } from "../model/Obstacle";
import { Shadow } from "@react-three/drei";

const metalTexture = new THREE.TextureLoader().load(MetalTexture);

metalTexture.wrapS = THREE.RepeatWrapping;
metalTexture.wrapT = THREE.RepeatWrapping;
metalTexture.repeat.set(1,1);

function Ramp(props: GroupProps): React.JSX.Element {
    return (<group {...props}>
        <mesh rotation={[Math.atan(10/4),0,0]}>
            <meshStandardMaterial map={metalTexture}/>
            <planeGeometry args={[1.8, Math.sqrt(10*10+4*4)]}/>
        </mesh>
    </group>)
}

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
            mesh = (<mesh rotation={[Math.PI,0,0]} position={[laneToOffset(lane), 2, 0]}>
                <meshStandardMaterial map={metalTexture}/>
                <planeGeometry args={[1.8, 2]}/>
            </mesh>);
            break;
        case ObstacleType.Over:
            mesh = (<mesh rotation={[Math.PI,0,0]} position={[laneToOffset(lane), 0.5, 0]}>
                <meshStandardMaterial map={metalTexture}/>
                <planeGeometry args={[1.8, 1]}/>
            </mesh>);
            break;
        case ObstacleType.WagonStart:
            mesh = <></>;
            break;
        case ObstacleType.Bar:
            mesh = (<mesh rotation={[Math.PI,0,0]} position={[laneToOffset(lane), 1, 0]}>
                <meshStandardMaterial map={metalTexture}/>
                <planeGeometry args={[1.8, 0.1]}/>
            </mesh>);
            break;
    }

    return <group ref={meshRef}>
        {mesh}
        {obstacle.type === ObstacleType.WagonStart ? <></> : <Shadow position={[laneToOffset(lane), 0.01, 0]} scale={[2.7,1,0.8]}/>}
    </group>
};
