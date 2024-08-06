import * as React from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import PlayerView from './PlayerView';
import { TerrainView } from './terrain/TerrainView';
import { Lane, laneToOffset } from '../model/Lane';
import { useSnapshot } from 'valtio';
import { gameState } from '..';
import { Surroundings } from './Surroundings';
import { ObstacleView } from './obstacle/ObstacleView';
import { PickupView } from './pickup/PickupView';
import Music from '../../assets/soundtrack.mp3';

function GGDiv(): React.JSX.Element {
    const snap = useSnapshot(gameState);
    return (<div style={{background: "rgba(0,0,0,.4)", width: "100%", height: "100%"}} onClick={() => {
        gameState.restartGame()
    }}>
        <div style={{color: "white", position: "absolute", top: "33%", left: "50%", transform: "translate(-50%, -50%)"}}>
            <h1>Föhseriet fångade dig!</h1>
            <p>
                Din poäng: {Math.floor(snap.currentInstance.score)} poäng<br/>
                Din högsta poäng: {Math.floor(Math.max(snap.currentInstance.score, snap.bestScore || 0))} poäng<br/>
                Klicka varsomhelst för att starta om!
            </p>
        </div>
    </div>)
}

function IntroductionScreen({ startMusic }: { startMusic: () => void }): React.JSX.Element {
    return <>
        <div style={{width: "100%", height: "100%", backgroundColor:"#32956a", position: "absolute", color: "white"}} onClick={(_) => {
            gameState.started = true;
            startMusic();
        }}>
            <div style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "2em",
                position: "relative",
                width: "min(80%, 50em)",
            }}>
                <h1 style={{textAlign: "center"}}>NØlle-surfers</h1>
                <p>
                    Å nej! Kjelly är sen till föreläsningen. Hjälp hen springa dit!
                    Föhseriet har dock försökt hindra hen så de har placerat
                    hinder på vägen. Hjälp hen undvika alla hinder genom att
                    hoppa och rulla. Hen har även tappat allt i sin väska på vägen, så
                    hjälp hen samla in sina grejer.
                </p>

                <p>
                    Om man sveper vänster och höger rör sig Kjelly vänster och
                    höger. Svep upp för att hoppa, och svep ner för att rulla.
                    Det går även bra att använda piltangenter, om du spelar på
                    en dator.
                </p>

                <h3>Klicka varsomhelst för att starta!</h3>
            </div>
        </div>
    </>;
}

export default function GameView(): React.JSX.Element {
    return (<>
    <Canvas scene={{background: new THREE.Color(0x77C1E4), fog: new THREE.Fog(0x77C1E4, 1, 100)}} camera={{position: [0,4,-2.5]}}>
        <React.StrictMode>
            <GameInner/>
        </React.StrictMode>
    </Canvas>
    <GameOverlay/>
    </>)
}

function GameOverlay(): React.JSX.Element {
    const snap = useSnapshot(gameState);
    const soundPlayer = React.useRef<null | HTMLAudioElement>(null);

    let overlay;

    if (!snap.started) {
        overlay = <IntroductionScreen startMusic={() => {
            if(soundPlayer.current) {
                soundPlayer.current.play();
            }
        }}/>;
    } else if (snap.currentInstance.gameOver) {
        overlay = <GGDiv/>;
    } else { // game is running
        overlay = <p style={{color: "white", position: "absolute", top: 10, left: "50%", transform: "translate(-50%, -50%)", fontFamily: "monospace"}}>
            {Math.floor(snap.currentInstance.score)} poäng
        </p>;
    }

    return (<>
        <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
                fontFamily: "monospace",
                fontSize: "1.5em"}}>
            {overlay}
        </div>
        <audio src={Music} autoPlay={true} preload='auto' ref={soundPlayer} playsInline={true} loop={true}/>
    </>);
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

    const terrains: React.JSX.Element[] = [];
    const obstacles: React.JSX.Element[] = [];
    const pickups: React.JSX.Element[] = [];

    const tm = useSnapshot(gameState).currentInstance.terrainManager;
    void tm.didChange; // to subscribe to updates
    for(let l of [Lane.Left, Lane.Center, Lane.Right]) {
        const ts = tm.terrains(l);
        for(const t of ts) { // grr performance perhaps
            terrains.push(<TerrainView terrainId={t.uuid} lane={l} key={t.uuid}/>)
        }
        const os = tm.obstacles(l);
        for(const o of os) {
            obstacles.push(<ObstacleView obstacleId={o.uuid} lane={l} key={o.uuid}/>);
        }
        const ps = tm.pickups(l);
        for(const p of ps) {
            pickups.push(<PickupView pickupId={p.uuid} lane={l} key={p.uuid}/>);
        }
    }

    return (
    <>
        <ambientLight intensity={2.2} />
        <Surroundings/>
        <PlayerView/>
        {terrains}
        {obstacles}
        {pickups}
    </>
    )
});
