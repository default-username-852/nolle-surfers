import * as React from "react";
import { Terrain, TerrainType } from "../model/Terrain";
import * as THREE from "three";
import MetalTexture from "../../assets/metal.png";
import { Lane, laneToOffset } from "../model/Lane";
import { GroupProps, useFrame } from "@react-three/fiber";
import { Train } from "./Train";
import { gameState } from "..";
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

export const TerrainView = React.memo(({lane, terrainId}: {lane: Lane, terrainId: string}): React.JSX.Element => {
    const meshRef = React.useRef<THREE.Group>(null);
    const terrain = gameState.currentInstance.terrainManager.terrainById(terrainId);

    if(!terrain) {
        console.error("invalid terrain ID: "+terrainId);
        return <></>;
    }

    useFrame((s, delta) => {
        if(meshRef.current) {
            const [lower, upper] = terrain.bounds();
            meshRef.current.position.z = (lower + upper) / 2;
            meshRef.current.visible = terrain.offset <= 40;
        }
    });

    let mesh;

    if ( terrain.type == TerrainType.Wagon) {
        mesh = (
            <Train position={[laneToOffset(lane), 0, 0]}/>
        );
    } else if (terrain.type == TerrainType.Ramp) {
        mesh = (
            <mesh rotation={[Math.atan(10/4)+Math.PI,0,0]} position={[laneToOffset(lane), 2, 0]}>
                <meshStandardMaterial map={metalTexture}/>
                <planeGeometry args={[1.8, Math.sqrt(10*10+4*4)]}/>
            </mesh>
        );
    }

    return (<group ref={meshRef}>
        {mesh}
        <Shadow position={[laneToOffset(lane), 0.01, 0]} scale={[3.5, 15, 1]} opacity={0.9}/>
    </group>)
}, (t1, t2) => {
    return t1.lane === t2.lane;
});
