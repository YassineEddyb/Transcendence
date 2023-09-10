import React, {useState} from 'react'

import {io} from "socket.io-client";
import { useParams } from "react-router-dom"

import { GameMode, Score } from './Interfaces';
import { ReactP5Wrapper } from "react-p5-wrapper"
import sketch from "./Skitch"
import useEffectOnUpdate from '../../Hooks/useEffectOnUpdate';

let gameModes = new Map<String, GameMode>([
    ["BattleRoyal", {
        modeName: "BattleRoyal",
        ball: "fireBall.png",
        background: "fire-game.jpg",
        paddle: "paddle.png",
        color: {r: 255, g: 154, b: 0, a: 1},
        xp: 6000,
        maxScore: 11
    }],
    ["TheBeat", {
        modeName: "TheBeat",
        ball: "fireBall.png",
        paddle: "paddle.png",
        background: "fire-game.jpg",
        color: {r: 135, g: 206, b: 235, a: 1},
        xp: 5000,
        maxScore: 7
    }],
    ["IceLand", {
        modeName: "IceLand",
        ball: "iceBall.png",
        paddle: "paddle.png",
        background: "iceLand.jpg",
        color: {r: 135, g: 206, b: 235, a: 1},
        xp: 4000,
        maxScore: 7
    }],
    ["BrighGround", {
        modeName: "BrighGround",
        ball: "fireBall.png",
        paddle: "paddle.png",
        background: "fire-game.jpg",
        color: {r: 135, g: 206, b: 235, a: 1},
        xp: 3000,
        maxScore: 5
    }],
]);


export default function Game () {
    const [isHost, setIsHost] = useState<boolean>(true);
    const [socket, setSocket] = useState<any>(null);
    const [gameKey, setGameKey] = useState<string | null>(null);
    const [isMatching, setIsMatching] = useState<boolean>(false);
    const [mode, setMode]  = useState<GameMode | null>(null);
    const [score, setScore] = useState<Score>({myScore: 0, oppScore: 0});
    
    // const { user } = useContext(UserContext);
    const {key, gameMode} = useParams();

    useEffectOnUpdate( () => {
        const newSocket: any = io("ws://localhost:4343");
        setSocket(newSocket);
        setMode(gameModes.get(gameMode))

        if (key && gameMode) {
            setGameKey(key);
            newSocket.emit("joinGame", key);
        } else if (gameMode) {
            setIsMatching(true);
            newSocket.emit("gameMatching", {
                modeName: gameModes.get(gameMode)?.modeName,
                xp: gameModes.get(gameMode)?.xp
            })

            newSocket.on("matched", (roomKey: string) => {
                console.log("matched room key: ", roomKey);
                setGameKey(roomKey);
                newSocket.emit("joinGame", roomKey);

                setIsMatching(false);
            })
        }

        return () => {
            console.log("component unmount");
            newSocket.emit("gameEnd", key)
            newSocket.disconnect();
        };
    }, [])


    return (
        <ReactP5Wrapper 
            sketch={sketch}
            socket={socket}
            theme="black"
            isHost={isHost}
            setIsHost={setIsHost}
            gameKey={gameKey}
            gameMode={mode}
            isMatching={isMatching}
            setScore={setScore}
        />
    );
}
