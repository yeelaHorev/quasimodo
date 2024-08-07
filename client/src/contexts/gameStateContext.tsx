import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { PieceCoordinates, selectedPlayerPosition } from "../consts";
import { Colors } from "../consts/Colors";
import { socket } from "../main";
import { useNicknameContext } from "./usernameContext";

type PlayerGameState = {
    pieces: PieceCoordinates[];
}

interface gameStateContext {
    playersGameState: Record<string, PlayerGameState> | null,
    setPlayersGameState: Dispatch<SetStateAction<Record<string, PlayerGameState> | null>>,
    addUsers: (users: string[]) => void,
    makeMove: (row: number, col: number, selectedPiece?: selectedPlayerPosition) => void
}
const GameStateContext = createContext<gameStateContext>({} as gameStateContext);

export function GameStateProvider({ children }: { children: ReactNode }) {
    const { nickname } = useNicknameContext()
    const [playersGameState, setPlayersGameState] = useState<Record<string, PlayerGameState> | null>(null);

    const me = playersGameState && playersGameState[nickname];

    const addUsers = (users: string[]) => {
        const myPosition: any = [];
        for (let i = 0; i <= 7; i++) {
            const row = 7
            myPosition.push({ row, col: i, color: Colors[7 - i] }
            )
        }

        const opponentsPosition: any = [];
        for (let i = 0; i <= 7; i++) {
            const row = 0
            opponentsPosition.push({ row, col: i, color: Colors[i] }
            )
        }

        setPlayersGameState({
            [nickname]: { pieces: myPosition },
            [users.find((key) => key !== nickname)!]: { pieces: opponentsPosition ,}
        })
    };

    // useEffect(() => {
    //     socket.on("game-state", (data: string) => {
    //         console.log('data: ', data);
    //         setPlayersGameState((prev) => {
    //             console.log()
    //             let newState: typeof prev = {};
    //             if (prev) newState = JSON.parse(JSON.stringify(prev))
    //             newState && Object.keys(newState).forEach(player => {
    //                 newState[player] = {
    //                     pieces: newState[player].pieces.map(piece => ({
    //                         ...piece,
    //                         isStarting: player === data,
    //                     })),
    //                 };
    //             });
    //             console.log("new state is ", ...newState)
    //             return newState;
    //         });
    //     });
    //     return () => {
    //         socket.off('game-state');
    //     };
    // }, [])

    const makeMove = (row: number, col: number, selectedPiece?: selectedPlayerPosition) => {
        if (selectedPiece && me) {
            const selectedPieceIndex = me?.pieces.findIndex(piece => {
                return piece.col === selectedPiece.col && piece.row === selectedPiece.row
            })
            if (selectedPieceIndex !== -1) {
                const updatedPiecesInfo = [...me.pieces];
                updatedPiecesInfo[selectedPieceIndex] =
                    { ...updatedPiecesInfo[selectedPieceIndex], row, col };
                const target = { row, col }
                socket.emit('make-move', {
                    playerName: nickname,
                    updatedPiecesInfo,
                    selectedPieceIndex,
                    target
                });
            }
        }
    }

    useEffect(() => {
        socket.on("make-move", (
            data: {
                playerName: string,
                pieces: PieceCoordinates[];
                selectedPieceIndex: number,
                target: selectedPlayerPosition
            }) => {
            const { playerName, pieces, selectedPieceIndex, target } = data
            const isMe = playerName === nickname
            const { row, col } = target
            if (selectedPieceIndex !== -1) {
                const updatedPiecesInfo = [...pieces];
                updatedPiecesInfo[selectedPieceIndex] =
                    { ...updatedPiecesInfo[selectedPieceIndex], row, col };
                const mirrorPieces = updatedPiecesInfo.map(({ col, row, color, isStarting }) => {
                    return { row: 7 - row, col: 7 - col, color, isStarting }
                })
                setPlayersGameState((prev) => {
                    if (!prev) return prev;
                    return ({
                        ...prev,
                        [playerName]: { pieces: isMe ? updatedPiecesInfo : mirrorPieces, }
                    });
                })
            }
        })
        return () => {
            socket.off('make-move')
        }
    }, [nickname])

    return (
        <GameStateContext.Provider
            value={{
                playersGameState,
                setPlayersGameState,
                addUsers,
                makeMove
            }}>
            {children}
        </GameStateContext.Provider>
    )
}

export const useGameStateContext = () => { return useContext(GameStateContext) };