import * as React from "react";
import { Terrain, TerrainType } from "../model/Terrain";
import * as THREE from "three";
import MetalTexture from "../../assets/metal.png";
import { Lane, laneToOffset } from "../model/Lane";
import { GroupProps } from "@react-three/fiber";

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

export function TerrainView({terrain, lane}: {terrain: Terrain, lane: Lane}): React.JSX.Element {
    const meshRef = React.useRef<THREE.Mesh & THREE.Group>(null);

    if (terrain.type == TerrainType.Wagon) {
        return (
            <mesh position={[laneToOffset(lane), 2, terrain.offset + 5]} ref={meshRef}>
                <boxGeometry args={[1.8,4,10]}/>
                <meshStandardMaterial map={metalTexture} side={THREE.DoubleSide}/>
            </mesh>
        );
    } else if (terrain.type == TerrainType.Ramp) {
        return (
            <mesh rotation={[Math.atan(10/4)+Math.PI,0,0]} position={[laneToOffset(lane), 2, terrain.offset + 5]} ref={meshRef}>
                <meshStandardMaterial map={metalTexture}/>
                <planeGeometry args={[1.8, Math.sqrt(10*10+4*4)]}/>
            </mesh>
        );
    }

    throw "uh oh";
}
