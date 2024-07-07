import * as THREE from "three";
import * as React from "react";
import RailTexturue from "./rail.jpg";
import { useFrame, useLoader } from "@react-three/fiber";
import { gameState } from "..";

function BottomPlate(): React.JSX.Element {
    const texture = useLoader(THREE.TextureLoader, RailTexturue) as THREE.Texture;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(15,3);
    texture.rotation = Math.PI / 2;

    return (
        <mesh rotation={[Math.PI/2, 0, 0]} position={[0,0,0]}>
            <planeGeometry args={[9, 50]} />
            <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
    );
}

export function Surroundings(): React.JSX.Element {
    const groupRef = React.useRef<THREE.Group>(null);

    useFrame((s, delta) => {
        if(groupRef.current) {
            groupRef.current.position.z = (gameState.currentInstance.worldOffset) % 10 + 23;
        }
    });

    return (<group ref={groupRef}>
        <BottomPlate/>
    </group>);
}
