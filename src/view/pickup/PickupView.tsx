
import * as React from "react";
import * as THREE from "three";
import { Lane, laneToOffset } from "../../model/Lane";
import { gameState } from "../..";
import { useFrame, useLoader } from "@react-three/fiber";
import { PickupType } from "../../model/Pickup";
import PencilModel from "./pencil.glb";
import {useGLTF} from "@react-three/drei";
import { GLTF } from "three-stdlib";
import BackgroundImage from "./background.png";

const ROTATION_SPEED: number = 4;

type GLTFResult = GLTF & {
    nodes: {
        Pencil_Low_pencil_0: THREE.Mesh
    }
    materials: {
        ['pencil.002']: THREE.MeshStandardMaterial
    }
}

const Pencil = React.forwardRef(function(props: JSX.IntrinsicElements['group'], ref: React.Ref<THREE.Group>) {
    const { nodes, materials } = useGLTF(PencilModel) as GLTFResult;
    const meshRef = React.useRef<THREE.Group | null>();
    
    useFrame((s, delta) => {
        if (meshRef.current) {
            meshRef.current.rotateY(delta * ROTATION_SPEED);
        }
    });
    
    return (
        <group {...props} dispose={null} ref={(obj) => {
            meshRef.current = obj;
            if (ref && ref instanceof Function) {
                ref(obj);
            } else if (ref && "current" in ref && obj) {
                (ref as React.MutableRefObject<THREE.Group>).current = obj;
            }
        }}>
            <mesh
                geometry={nodes.Pencil_Low_pencil_0.geometry}
                material={materials['pencil.002']}
                rotation={[0, 0, 0.734]}
                scale={3.948}/>
        </group>
    );
});

useGLTF.preload(PencilModel)

export const PickupView = function({lane, pickupId}: {lane: Lane, pickupId: string}): React.JSX.Element {
    const meshRef = React.useRef<THREE.Mesh & THREE.Group>(null);
    const pickup = gameState.currentInstance.terrainManager.pickupById(pickupId);
    const circleTextureMap = useLoader(THREE.TextureLoader, BackgroundImage) as THREE.Texture;

    if(!pickup) {
        console.error("invalid pickup ID: "+pickupId);
        return <></>;
    }

    useFrame((s, delta) => {
        if(meshRef.current) {
            meshRef.current.position.y = pickup.height;
            meshRef.current.position.z = pickup.offset;
            //meshRef.current.visible = pickup.offset <= 40;
        }
    });

    switch(pickup.type) {
        case PickupType.Notes:
            return (<mesh position={[laneToOffset(lane), 2, 5]} ref={meshRef}>
                <meshStandardMaterial color={0xff0000}/>
                <boxGeometry args={[0.2, 0.2, 0.2]}/>
            </mesh>);
        case PickupType.Pencil:
            return <group position={[laneToOffset(lane), 2, 0]} ref={meshRef}>
                <Pencil scale={[3,3,3]}/>;
                <sprite position={[0,0,0.5]} scale={[1.5,1.5,1.5]}>
                    <spriteMaterial map={circleTextureMap}/>
                </sprite>
            </group>;
    }
}

useGLTF.preload(PencilModel);
