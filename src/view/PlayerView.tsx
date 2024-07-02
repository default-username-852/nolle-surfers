import { useFrame } from "@react-three/fiber";
import Player from "../model/Player";
import * as React from "react";
import * as THREE from "three";

export default function PlayerView(props: { player: Player }): React.JSX.Element {
    const meshRef = React.useRef<THREE.Mesh>(null);

    useFrame((s, delta) => {
        if (meshRef.current) {
            meshRef.current.position.y = props.player.height + 1;
        }
    })

    return (
        <mesh position={[0,1,0]} ref={meshRef}>
            <boxGeometry args={[1,2,1]}/>
            <meshStandardMaterial color={0xff0000}/>
        </mesh>
    );
}
