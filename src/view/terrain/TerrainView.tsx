import * as React from "react";
import { TerrainType } from "../../model/Terrain";
import * as THREE from "three";
import { GLTF } from 'three-stdlib';
import { Lane, laneToOffset } from "../../model/Lane";
import { useFrame } from "@react-three/fiber";
import { Train } from "./Train";
import { gameState } from "../..";
import { Shadow, ShadowType } from "@react-three/drei";
import { useGLTF } from '@react-three/drei';
import RampModel from "./ramp_stylized.glb";

/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: Andres_Krca (https://sketchfab.com/AndresKrca)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/ramp-stylized-37d1ea73e436446ba8401c86ef0682f7
Title: Ramp Stylized
*/

function Ramp(props: JSX.IntrinsicElements['group']) {
    type GLTFResult = GLTF & {
        nodes: {
            Cube006__0: THREE.Mesh
        }
        materials: {
            ['Scene_-_Root']: THREE.MeshStandardMaterial
        }
    }

    const { nodes, materials } = useGLTF(RampModel) as GLTFResult;
    return (
        <group {...props} dispose={null}>
            <group>
                <mesh
                    geometry={nodes.Cube006__0.geometry}
                    material={materials['Scene_-_Root']}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={1}/>
            </group>
        </group>
    );
}

useGLTF.preload(RampModel);

export const TerrainView = React.memo(({lane, terrainId}: {lane: Lane, terrainId: string}): React.JSX.Element => {
    const meshRef = React.useRef<THREE.Group>(null);
    const shadowRef = React.useRef<ShadowType>(null);
    const terrain = gameState.currentInstance.terrainManager.terrainById(terrainId);

    if(!terrain) {
        console.error("invalid terrain ID: "+terrainId);
        return <></>;
    }

    useFrame((s, delta) => {
        if(meshRef.current) {
            const [lower, upper] = terrain.bounds();
            meshRef.current.position.z = (lower + upper) / 2;
        }
        if(shadowRef.current) {
            shadowRef.current.visible = terrain.offset <= 75;
        }
    });

    let mesh;

    if ( terrain.type == TerrainType.Wagon) {
        mesh = (
            <Train position={[laneToOffset(lane), 0, 0]} rotation={[0,Math.PI,0]} scale={[1,1,1.03]}/>
        );
    } else if (terrain.type == TerrainType.Ramp) {
        mesh = (
            <Ramp position={[laneToOffset(lane), 0, 1.25]} scale={[1.8,5.5,4]}/>
        );
    }

    return (<group ref={meshRef}>
        {mesh}
        <Shadow position={[laneToOffset(lane), 0.01, 0]} scale={[3.5, 15, 1]} opacity={0.9} ref={shadowRef}/>
    </group>)
}, (t1, t2) => {
    return t1.lane === t2.lane;
});
