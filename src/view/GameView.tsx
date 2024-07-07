import * as React from 'react';
import * as THREE from 'three';
import GravelTexture from "../../assets/gravel.png";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Game, GameInstance } from '../model/Game';
import PlayerView from './PlayerView';
import { TerrainView } from './TerrainView';
import { Lane, laneToOffset } from '../model/Lane';
import { subscribe, useSnapshot } from 'valtio';
import { gameState } from '..';

const grassTexture = new THREE.TextureLoader().load(GravelTexture);

grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(3,15);

function GGDiv(): React.JSX.Element {
    const snap = useSnapshot(gameState);
    return (<div style={{position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.4)"}}>
        <div style={{color: "white", position: "absolute", top: "33%", left: "50%", transform: "translate(-50%, -50%)"}}>
            <h1 style={{fontFamily: "monospace"}}>Game over!</h1>
            <p style={{fontFamily: "monospace"}}>
                Final score: {Math.floor(snap.currentInstance.score)} points<br/>
                Best score: {Math.floor(Math.max(snap.currentInstance.score, snap.bestScore || 0))} points<br/>
                Press Space to restart
            </p>
        </div>
    </div>)
}

export default function GameView(): React.JSX.Element {
    const snap = useSnapshot(gameState).currentInstance;

    return (<>
    <Canvas scene={{background: new THREE.Color(0x000000)}} camera={{position: [0,4,-2.5]}}>
        <React.StrictMode>
            <GameInner/>
        </React.StrictMode>
    </Canvas>
    {snap.gameOver ? <GGDiv/> : <p style={{color: "white", position: "absolute", top: 10, left: "50%", transform: "translate(-50%, -50%)", fontFamily: "monospace"}}>
        {Math.floor(snap.score)} points
    </p>}
    </>)
}


const GameInner = React.memo((): React.JSX.Element => {
    const getThree = useThree(s => s.get);

    React.useEffect(() => {
        getThree().camera.lookAt(new THREE.Vector3(0,0,6));
    }, []);

    const cameraFloatTime = React.useRef(0);
    useFrame(({camera}, delta) => {
        const newCameraPos = gameState.currentInstance.groundHeight() + 4;
        if (camera.position.y < newCameraPos) {
            cameraFloatTime.current = 0.5;
        }

        if (cameraFloatTime.current > 0 && camera.position.y > newCameraPos) {
            cameraFloatTime.current = Math.max(cameraFloatTime.current - delta, 0);
        } else {
            camera.position.y = THREE.MathUtils.damp(camera.position.y, gameState.currentInstance.groundHeight() + 4, 2, delta);
        }

        camera.position.x = THREE.MathUtils.damp(camera.position.x, laneToOffset(gameState.currentInstance.player.lane) * 0.8, 5, delta);
    });

    const terrains: Array<React.JSX.Element> = [];

    let count = 0;
    for(let l of [Lane.Left, Lane.Center, Lane.Right]) {
        const ts = useSnapshot(gameState).currentInstance.terrainManager.terrain[l];
        for(let t of ts.toArray()) { // grr performance perhaps
            terrains.push(<TerrainView terrainId={t.uuid} lane={l} key={t.uuid}/>)
            count++;
        }
    }

    return (
    <>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <mesh rotation={[Math.PI/2, 0, 0]} position={[0,0,23]}>
            <planeGeometry args={[6, 50]} />
            <meshStandardMaterial map={grassTexture} side={THREE.DoubleSide} />
        </mesh>
        <PlayerView/>
        {terrains}
    </>
    )
});
