
import * as React from "react";
import * as THREE from "three";
import { Lane, laneToOffset } from "../model/Lane";
import { gameState } from "..";
import { useFrame } from "@react-three/fiber";
import { PickupType } from "../model/Pickup";

export const PickupView = function({lane, pickupId}: {lane: Lane, pickupId: string}): React.JSX.Element {
    const meshRef = React.useRef<THREE.Mesh & THREE.Group>(null);
    const pickup = gameState.currentInstance.terrainManager.pickupById(pickupId);

    if(!pickup) {
        console.error("invalid pickup ID: "+pickupId);
        return <></>;
    }

    useFrame((s, delta) => {
        if(meshRef.current) {
            meshRef.current.position.y = pickup.height;
            meshRef.current.position.z = pickup.offset;
            meshRef.current.visible = pickup.offset <= 40;
        }
    });

    switch(pickup.type) {
        case PickupType.Notes:
            return (<mesh position={[laneToOffset(lane), 2, 5]} ref={meshRef}>
                <meshStandardMaterial color={0xff0000}/>
                <boxGeometry args={[0.2, 0.2, 0.2]}/>
            </mesh>);
    }
}
