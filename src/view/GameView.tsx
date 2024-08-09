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
import { GameOverlay, Loading } from './Overlay';

export default function GameView(): React.JSX.Element {
    if (useSnapshot(gameState).loading) {
        return <Loading/>;
    } else {
        return (<>
            <Canvas scene={{background: new THREE.Color(0x77C1E4), fog: new THREE.Fog(0x77C1E4, 1, 100)}} camera={{position: [0,4,-2.5]}}>
                <React.StrictMode>
                    <GameInner/>
                </React.StrictMode>
            </Canvas>
            <GameOverlay/>
        </>);
    }
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
