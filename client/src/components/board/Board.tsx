import React, { useState } from 'react';
import { PieceCoordinates, selectedPlayerPosition } from '../../consts';
import { Colors } from '../../consts/Colors';
import { useMyTurnContext } from '../../contexts';
import { useGameStateContext } from '../../contexts/gameStateContext';
import { useNicknameContext } from '../../contexts/usernameContext';
import EndGame from '../end/EndGame';
import { Player } from '../player/Player';
import { Square } from '../square/Square';
import './Board.scss';

export const Board: React.FC = () => {
    const [selectedPiece, setSelectedPiece] = useState<selectedPlayerPosition | null>(null);
    const { playersGameState,
        makeMove,
        requestedColor,
        winner
    } = useGameStateContext();
    const { myTurn, isStarting } = useMyTurnContext()
    const { nickname } = useNicknameContext()


    const choosePlayer = (row: number, col: number) => {
        if (!selectedPiece) {
            setSelectedPiece({ row, col })
        } else {
            setSelectedPiece(null)
        }
    }

    const availablePositionsOnBoard = (index: number) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        let sum: PieceCoordinates[] = [];
        for (const piece of Object.values(playersGameState!)) {
            sum = [...sum, ...piece.pieces];
        }

        const inCol = (selectedPiece?.col === col) &&
            sum.filter(player => {
                return player.col === selectedPiece?.col && player.row < selectedPiece.row
            }).reduce((acc, currValue) => {
                return Math.max(acc, currValue.row)
            }, -1)

        const straightLine = selectedPiece && (inCol ? (row > inCol) : (selectedPiece?.col === col))

        const diagonal = selectedPiece && (Math.abs(row - selectedPiece.row) === Math.abs(col - selectedPiece.col))


        const inDiagonal = diagonal && playersGameState && sum.filter(player => {
            return ((player.row < selectedPiece.row) && (Math.abs(selectedPiece.row - player.row) === Math.abs(player.col - selectedPiece.col)) && player.row !== 7)
        }).reduce((acc, currValue) => {
            if (currValue.col < selectedPiece.col) {
                return { ...acc, maxLeft: Math.max(acc.maxLeft, currValue.row), }
            }
            else if (currValue.col > selectedPiece.col) {
                return { ...acc, maxRight: Math.max(acc.maxRight, currValue.row), }
            }
            else return acc;
        }, { maxLeft: - 1, maxRight: -1 })

        const diagonals = selectedPiece && inDiagonal && (
            col > selectedPiece.col ?
                (row > inDiagonal.maxRight) :
                (row > inDiagonal.maxLeft))

        const back = selectedPiece && (row < selectedPiece.row)
        const noPlayers = !sum.find(player => {
            return player.col === col && player.row === row
        })

        return (diagonals || straightLine) && noPlayers && back
    }


    return (
        <>
            {winner ?
                <EndGame onPlayAgain={() => { }} winnerName={winner} />
                : <>
                    <h1
                        className={`turn-banner ${(isStarting && myTurn) || (!isStarting && !myTurn)
                                ? "black-turn"
                                : "white-turn"
                            }`}
                    >
                        It's {myTurn ? "your" : "opponent's"} turn!
                    </h1>


                    {
                        playersGameState ?
                            <div className='chessboard' >
                                {Colors.map((color, index) => {
                                    const row = Math.floor(index / 8);
                                    const col = index % 8;
                                    const pieceA = playersGameState[nickname]

                                    const pieceB = playersGameState
                                        ? Object.entries(playersGameState).find(([key]) => key !== nickname)?.[1]
                                        : undefined;

                                    const myPieces = pieceA
                                        ? pieceA.pieces.find(piece => piece.col === col && piece.row === row)
                                        : undefined;


                                    const opponentPieces = pieceB
                                        ? pieceB.pieces.find(piece => piece.col === col && piece.row === row)
                                        : undefined;


                                    const isAvailable = availablePositionsOnBoard(index)
                                    let disabled = false
                                    if (!myTurn) {
                                        disabled = true
                                    }
                                    else if (!myPieces) {
                                        disabled = true
                                    }
                                    else if (myPieces && requestedColor) {
                                        disabled = myPieces.color !== requestedColor
                                    } else disabled = false
                                    return (
                                        <div key={index} className='container'>
                                            {(myPieces || opponentPieces) &&
                                                <Player
                                                    myTurn={disabled}
                                                    isStarting={myPieces ? isStarting : !isStarting}
                                                    isSelected={(col === selectedPiece?.col && row === selectedPiece.row)}
                                                    onClick={() => choosePlayer(row, col)}
                                                    innerCircleColor={myPieces ? myPieces.color : opponentPieces ? opponentPieces.color : ""}
                                                />
                                            }
                                            <Square noPlayerSelected={!selectedPiece} color={color} onClick={() => {
                                                if (!selectedPiece) return
                                                makeMove(row, col, color, selectedPiece)
                                                setSelectedPiece(null)
                                            }
                                            }
                                                disabled={!isAvailable} />
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <></>}
                </>
            } </>
    );
};
