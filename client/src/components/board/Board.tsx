import React, { useState } from 'react';
import { PieceCoordinates, selectedPlayerPosition } from '../../consts';
import { Colors } from '../../consts/Colors';
import { useGameStateContext } from '../../contexts/gameStateContext';
import { Player } from '../player/Player';
import { Square } from '../square/Square';
import './Board.scss';
import { useNicknameContext } from '../../contexts/usernameContext';

export const Board: React.FC = () => {
    const [selectedPiece, setSelectedPiece] = useState<selectedPlayerPosition | null>(null);
    const { playersGameState,
        makeMove,
    } = useGameStateContext();
    const { 
        nickname
    }
        =
        useNicknameContext()
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
            {playersGameState ?
                <div className='chessboard' >

                    {Colors.map((color, index) => {
                        const row = Math.floor(index / 8);
                        const col = index % 8;
                        const pieceA = playersGameState[nickname]
                        ...
                        if(pieceA)
                        const piecesOnBoard = playersGameState ? Object.values(playersGameState)
                            .map(playerGameState =>
                                playerGameState.pieces.find(piece => piece.col === col && piece.row === row)
                            )
                            .find(piece => piece !== undefined)
                            : undefined;
                        const isAvailable = availablePositionsOnBoard(index)

                        return (
                            <div key={index} className='container'>
                                {piecesOnBoard &&
                                    <Player
                                        isStarting={piecesOnBoard.isStarting}
                                        isSelected={(col === selectedPiece?.col && row === selectedPiece.row)}
                                        onClick={() => choosePlayer(row, col)}
                                        innerCircleColor={piecesOnBoard.color}
                                    />

                                }
                                <Square noPlayerSelected={!selectedPiece} color={color} onClick={() => {
                                    if (!selectedPiece) return
                                    makeMove(row, col, selectedPiece)
                                    setSelectedPiece(null)
                                }
                                }
                                    disabled={!isAvailable} />
                            </div>
                        )
                    })}
                </div>
                : <></>
            } </>
    );
};
