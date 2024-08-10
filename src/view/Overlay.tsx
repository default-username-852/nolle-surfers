import { useSnapshot } from 'valtio';
import Music from '../../assets/soundtrack.mp3';
import * as React from "react";
import { gameState } from '..';
import { useFrame } from '@react-three/fiber';

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
                <h1 style={{textAlign: "center"}}>nØlle-surfers</h1>
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

export function Loading(): React.JSX.Element {
    const [dots, setDots] = React.useState(1);
    
    React.useEffect(() => {
        const i = setInterval(() => {
            setDots(dots % 3 + 1);
        }, 1000);
        return () => {
            clearInterval(i);
        }
    }, []);
    
    let string = "Laddar";
    
    for(let i = 0; i < dots; ++i) {
        string += ".";
    }
    
    return (
        <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: "100%",
                fontFamily: "monospace", backgroundColor:"#32956a", color: "white",
                fontSize: "1.5em"}}>
            <h1 style={{
                margin: "auto",
                position: "relative",
                textAlign: "center",
                top: "50%",
                transform: "translate(0,-50%)"
            }}>
                {string}
            </h1>
        </div>
    );
}

function PointsDisplay(): React.JSX.Element {
    const ref = React.useRef<HTMLParagraphElement>(null);
    
    React.useEffect(() => {
        const i = setInterval(() => {
            if(ref.current) {
                ref.current.innerHTML = `${Math.floor(gameState.currentInstance.score)} poäng`;
            }
        }, 100);
        return () => {
            clearInterval(i);
        }
    }, []);
    
    return <p 
        style={{color: "white", position: "absolute", top: 10, left: "50%", transform: "translate(-50%, -50%)", fontFamily: "monospace"}} 
        ref={ref}>
            0 poäng
    </p>;
}

export function GameOverlay(): React.JSX.Element {
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
        overlay = <PointsDisplay/>;
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
