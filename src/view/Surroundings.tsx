import * as THREE from "three";
import * as React from "react";
import GravelTexture from "../../assets/gravel.png";
import { useFrame } from "@react-three/fiber";
import { gameState } from "..";

const grassTexture = new THREE.TextureLoader().load(GravelTexture);

grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(3,15);

export function Surroundings(): React.JSX.Element {
    const groupRef = React.useRef<THREE.Group>(null);

    useFrame((s, delta) => {
        if(groupRef.current) {
            groupRef.current.position.z = (gameState.currentInstance.worldOffset) % 10 + 23;
        }
    });

    return (<group ref={groupRef}>
        <mesh rotation={[Math.PI/2, 0, 0]} position={[0,0,0]}>
            <planeGeometry args={[9, 50]} />
            <meshStandardMaterial map={grassTexture} side={THREE.DoubleSide} />
        </mesh>
    </group>);
}
