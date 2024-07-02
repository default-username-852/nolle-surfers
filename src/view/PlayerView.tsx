import { useFrame } from "@react-three/fiber";
import Player from "../model/Player";
import * as React from "react";
import * as THREE from "three";
import { useSnapshot } from "valtio";
import { laneToOffset } from "../model/Lane";

export default function PlayerView({player}: { player: Player }): React.JSX.Element {
    const meshRef = React.useRef<THREE.Mesh>(null);
    const snap = useSnapshot(player);

    useFrame((s, delta) => {
        if (meshRef.current) {
            meshRef.current.position.y = player.height + 1;
        }
    })

    return (
        <mesh position={[laneToOffset(snap.lane),1,0]} ref={meshRef}>
            <boxGeometry args={[1,2,1]}/>
            <meshStandardMaterial color={0xff0000}/>
        </mesh>
    );
}
