import * as React from 'react';
import * as THREE from 'three';
import GravelTexture from "../../assets/gravel.png";
import { Canvas, useThree } from '@react-three/fiber';
import { Game } from '../model/Game';
import PlayerView from './PlayerView';
import { TerrainView } from './TerrainView';
import { Lane } from '../model/Lane';
import { useSnapshot } from 'valtio';

const grassTexture = new THREE.TextureLoader().load(GravelTexture);

grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(3,15);

export default function GameView({ game }: { game: Game }): React.JSX.Element {
    return (
    <Canvas scene={{background: new THREE.Color(0x000000)}} camera={{position: [0,4,-3]}}>
        <React.StrictMode>
            <GameInner game={game}/>
        </React.StrictMode>
    </Canvas>
    )
}


function GameInner({game}: {game: Game}): React.JSX.Element {
    const snap = useSnapshot(game);

    const camera = useThree(s => s.camera);

    React.useEffect(() => {
        camera.lookAt(new THREE.Vector3(0,0,5));
    }, []);

    const terrains: Array<React.JSX.Element> = [];

    let count = 0;
    for(let l of [Lane.Left, Lane.Center, Lane.Right]) {
        const ts = snap.terrain[l];
        for(let t of ts.toArray()) { // grr performance perhaps
            terrains.push(<TerrainView terrain={t} lane={l} key={l}/>)
            count++;
        }
    }

    return (
    <>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <mesh rotation={[Math.PI/2, 0, 0]}>
            <planeGeometry args={[6, 30]} />
            <meshStandardMaterial map={grassTexture} side={THREE.DoubleSide} />
        </mesh>
        <PlayerView player={game.player}/>
        {terrains}
    </>
    )
}
