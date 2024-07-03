import Player from "../model/Player";
import * as React from "react";
import { laneToOffset } from "../model/Lane";

export default function PlayerView({player}: { player: Player }): React.JSX.Element {
    return (
        <mesh position={[laneToOffset(player.lane),player.height + 1,0]}>
            <boxGeometry args={[1,2,1]}/>
            <meshStandardMaterial color={0xff0000}/>
        </mesh>
    );
}
