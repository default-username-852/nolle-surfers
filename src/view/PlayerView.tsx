import Player from "../model/Player";
import * as React from "react";
import { laneToOffset } from "../model/Lane";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PlayerView({player}: { player: Player }): React.JSX.Element {
    const meshRef = React.useRef<THREE.Mesh>(null);
    const xPos = React.useRef(0);

    useFrame((s, delta) => {
        if (meshRef.current) {
            meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, laneToOffset(player.lane), 10, delta);
            xPos.current = meshRef.current.position.x;
        }
    })

    return (
        <mesh position={[xPos.current,player.height + 1,0]} ref={meshRef}>
            <boxGeometry args={[1,2,1]}/>
            <meshStandardMaterial color={0xff0000}/>
        </mesh>
    );
}
