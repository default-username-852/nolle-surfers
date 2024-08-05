
import * as React from "react";
import * as THREE from "three";
import { Lane, laneToOffset } from "../../model/Lane";
import { gameState } from "../..";
import { useFrame, useLoader } from "@react-three/fiber";
import { PickupType } from "../../model/Pickup";
import PencilModel from "./pencil.glb";
import BookModel from "./book.glb";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import BackgroundImage from "./background.png";

const ROTATION_SPEED: number = 4;

const Pencil = React.forwardRef(function(props: JSX.IntrinsicElements['group'], ref: React.Ref<THREE.Group>) {
    type GLTFResult = GLTF & {
        nodes: {
            Pencil_Low_pencil_0: THREE.Mesh
        }
        materials: {
            ['pencil.002']: THREE.MeshStandardMaterial
        }
    }
    
    const { nodes, materials } = useGLTF(PencilModel) as GLTFResult;
    
    return (
        <group {...props} dispose={null} ref={ref}>
            <mesh
                geometry={nodes.Pencil_Low_pencil_0.geometry}
                material={materials['pencil.002']}
                scale={3.948}/>
        </group>
    );
});

useGLTF.preload(PencilModel);

const Book = React.forwardRef(function(props: JSX.IntrinsicElements['group'], ref: React.Ref<THREE.Group>) {
    type GLTFResult = GLTF & {
        nodes: {
        Book_0: THREE.Mesh
        Book_1: THREE.Mesh
        }
        materials: {
        BookMaterial: THREE.MeshStandardMaterial
        BookPaperMaterial: THREE.MeshStandardMaterial
        }
    }

    const { nodes, materials } = useGLTF(BookModel) as GLTFResult;
    return (
        <group {...props} dispose={null} ref={ref}>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={1}>
                <mesh
                    geometry={nodes.Book_0.geometry}
                    material={materials.BookMaterial}/>
                <mesh
                    geometry={nodes.Book_1.geometry}
                    material={materials.BookPaperMaterial}/>
            </group>
        </group>
    );
});

useGLTF.preload(BookModel);

export const PickupView = function({lane, pickupId}: {lane: Lane, pickupId: string}): React.JSX.Element {
    const groupRef = React.useRef<THREE.Group>(null);
    const meshRef = React.useRef<THREE.Mesh & THREE.Group>(null);
    const pickup = gameState.currentInstance.terrainManager.pickupById(pickupId);
    const circleTextureMap = useLoader(THREE.TextureLoader, BackgroundImage) as THREE.Texture;

    if(!pickup) {
        console.error("invalid pickup ID: "+pickupId);
        return <></>;
    }

    useFrame((s, delta) => {
        if(groupRef.current) {
            groupRef.current.position.y = pickup.height;
            groupRef.current.position.z = pickup.offset;
        }
        if(meshRef.current) {
            meshRef.current.rotateOnWorldAxis(new THREE.Vector3(0,1,0),delta*ROTATION_SPEED);
        }
    });
    
    let pickupElement;
    switch(pickup.type) {
        case PickupType.Notes:
            pickupElement = (<mesh ref={meshRef}>
                <meshStandardMaterial color={0xff0000}/>
                <boxGeometry args={[0.2, 0.2, 0.2]}/>
            </mesh>);
            break;
        case PickupType.Pencil:
            pickupElement = <Pencil scale={[3,3,3]} rotation={[0,0,Math.PI / 4]} ref={meshRef}/>;
            break;
        case PickupType.Book:
            pickupElement = <Book scale={0.5} rotation={[0,0,Math.PI / 3.5]} ref={meshRef}/>;
            break;
    }
    
    return (
        <group position={[laneToOffset(lane), 2, 0]} ref={groupRef}>
            {pickupElement}
            <sprite position={[0,0,0.5]} scale={[1.5,1.5,1.5]}>
                <spriteMaterial map={circleTextureMap}/>
            </sprite>
        </group>
    );
}

