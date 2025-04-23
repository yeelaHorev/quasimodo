import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { PieceCoordinates, selectedPlayerPosition } from "../consts";
import { Colors } from "../consts/Colors";
import { socket } from "../main";
import { useNicknameContext } from "./usernameContext";
import { useMyTurnContext } from "./isMyTurnContext";

type PlayerGameState = {
    pieces: PieceCoordinates[];
}

interface gameStateContext {
    playersGameState: Record<string, PlayerGameState> | null,
    requestedColor: string;
    winner: string;
    setPlayersGameState: Dispatch<SetStateAction<Record<string, PlayerGameState> | null>>,
    setRequestedColor: Dispatch<SetStateAction<string>>;
    setWinner: Dispatch<SetStateAction<string>>;
    addUsers: (users: string[]) => void,
    makeMove: (row: number, col: number, color: string, selectedPiece?: selectedPlayerPosition) => void
}
const GameStateContext = createContext<gameStateContext>({} as gameStateContext);

export function GameStateProvider({ children }: { children: ReactNode }) {
    const { nickname } = useNicknameContext()
    const [playersGameState, setPlayersGameState] = useState<Record<string, PlayerGameState> | null>(null);
    const [requestedColor, setRequestedColor] = useState<string>("");
    const [winner, setWinner] = useState<string>("");

    const { ChangeTurns } = useMyTurnContext()
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
            [users.find((key) => key !== nickname)!]: { pieces: opponentsPosition, }
        })

    };


    const makeMove = (row: number, col: number, color: string, selectedPiece?: selectedPlayerPosition) => {
        if (selectedPiece && me) {
            const selectedPieceIndex = me?.pieces.findIndex(piece => {
                return piece.col === selectedPiece.col && piece.row === selectedPiece.row
            })
            if (selectedPieceIndex !== -1) {
                const updatedPiecesInfo = [...me.pieces];
                updatedPiecesInfo[selectedPieceIndex] =
                    { ...updatedPiecesInfo[selectedPieceIndex], row, col };
                const target = { row, col, color }
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
                target: PieceCoordinates
            }) => {
            const { playerName, pieces, selectedPieceIndex, target } = data
            const isMe = playerName === nickname
            const { row, col, color } = target
            if(row === 0) {
                setWinner(playerName)
                return
            }
            if (selectedPieceIndex !== -1) {
                const updatedPiecesInfo = [...pieces];
                updatedPiecesInfo[selectedPieceIndex] =
                    { ...updatedPiecesInfo[selectedPieceIndex], row, col };
                const mirrorPieces = updatedPiecesInfo.map(({ col, row, color }) => {
                    return { row: 7 - row, col: 7 - col, color }
                })
                setPlayersGameState((prev) => {
                    if (!prev) return prev;
                    return ({
                        ...prev,
                        [playerName]: { pieces: isMe ? updatedPiecesInfo : mirrorPieces, }
                    });
                })
                ChangeTurns()
                setRequestedColor(color)
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
                requestedColor,
                winner,
                setRequestedColor,
                setPlayersGameState,
                addUsers,
                makeMove,
                setWinner
            }}>
            {children}
        </GameStateContext.Provider>
    )
}

export const useGameStateContext = () => { return useContext(GameStateContext) };