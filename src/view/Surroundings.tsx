import * as THREE from "three";
import * as React from "react";
import RailTexturue from "./rail.jpg";
import Skyline from "./skyline.jpg";
import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { gameState } from "..";

function BottomPlate(): React.JSX.Element {
    const texture = useLoader(THREE.TextureLoader, RailTexturue) as THREE.Texture;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(15,3);
    texture.rotation = Math.PI / 2;

    return (
        <>
            <mesh rotation={[Math.PI/2, 0, 0]} position={[0,0,0]}>
                <planeGeometry args={[9, 50]} />
                <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[Math.PI/2, 0, 0]} position={[6.5,0,0]}>
                <planeGeometry args={[4, 50]}/>
                <meshStandardMaterial color={0x888888} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[Math.PI/2, 0, 0]} position={[-6.5,0,0]}>
                <planeGeometry args={[4, 50]}/>
                <meshStandardMaterial color={0x888888} side={THREE.DoubleSide} />
            </mesh>
        </>
    );
}

function Wall(props: MeshProps): React.JSX.Element {
    const texture = useLoader(THREE.TextureLoader, Skyline) as THREE.Texture;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3,1);
    texture.rotation = Math.PI / 2;

    return (<mesh {...props} rotation={[0,Math.PI/2,3*Math.PI/2]}>
        <planeGeometry args={[10, 50]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>)
}

function Roof(props: MeshProps): React.JSX.Element {
    return (<mesh {...props} rotation={[Math.PI/2,0,0]}>
        <planeGeometry args={[17, 50]} />
        <meshStandardMaterial side={THREE.DoubleSide} color={0x77C1E4}/>
    </mesh>)
}

export function Surroundings(): React.JSX.Element {
    const groupRef = React.useRef<THREE.Group>(null);
    const groupRef2 = React.useRef<THREE.Group>(null);

    useFrame((s, delta) => {
        if(groupRef.current) {
            groupRef.current.position.z = -(gameState.currentInstance.worldOffset) % 100 + 73;
        }
        if(groupRef2.current) {
            groupRef2.current.position.z = -(gameState.currentInstance.worldOffset + 50) % 100 + 73;
        }
    });

    return (<>
        <group ref={groupRef}>
            <BottomPlate/>
            <Wall position={[-8.5,5,0]}/>
            <Wall position={[8.5,5,0]}/>
            <Roof position={[0,9.99,0]}/>
        </group>
        <group ref={groupRef2}>
            <BottomPlate/>
            <Wall position={[-8.5,5,0]}/>
            <Wall position={[8.5,5,0]}/>
            <Roof position={[0,9.99,0]}/>
        </group>
    </>);
}
