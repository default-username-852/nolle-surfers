import * as React from "react";
import { Terrain, TerrainType } from "../model/Terrain";
import * as THREE from "three";
import MetalTexture from "../../assets/metal.png";
import { Lane, laneToOffset } from "../model/Lane";
import { GroupProps, useFrame } from "@react-three/fiber";
import { gameState } from "..";
import { ObstacleType } from "../model/Obstacle";

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
    const meshRef = React.useRef<THREE.Mesh & THREE.Group>(null);
    const obstacle = gameState.currentInstance.terrainManager.obstacleById(obstacleId);

    if(!obstacle) {
        console.error("invalid terrain ID: "+obstacleId);
        return <></>;
    }

    useFrame((s, delta) => {
        if(meshRef.current) {
            meshRef.current.position.x = laneToOffset(lane);
            meshRef.current.position.z = obstacle.offset;
            meshRef.current.visible = obstacle.offset <= 40;
        }
    });

    switch(obstacle.type) {
        case ObstacleType.Under:
            return (<mesh rotation={[Math.PI,0,0]} position={[laneToOffset(lane), 2, 5]} ref={meshRef}>
                <meshStandardMaterial map={metalTexture}/>
                <planeGeometry args={[1.8, 2]}/>
            </mesh>);
        case ObstacleType.Over:
            return (<mesh rotation={[Math.PI,0,0]} position={[laneToOffset(lane), 0.5, 5]} ref={meshRef}>
                <meshStandardMaterial map={metalTexture}/>
                <planeGeometry args={[1.8, 1]}/>
            </mesh>);
        case ObstacleType.WagonStart:
            return <></>;
        case ObstacleType.Bar:
            return (<mesh rotation={[Math.PI,0,0]} position={[laneToOffset(lane), 1, 5]} ref={meshRef}>
                <meshStandardMaterial map={metalTexture}/>
                <planeGeometry args={[1.8, 0.1]}/>
            </mesh>);
    }
};
