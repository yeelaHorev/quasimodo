import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Loading } from '../../components/loading/Loading';
import { useNicknameContext } from '../../contexts/usernameContext';
import { socket } from '../../main';

import { Button } from '@mui/material';
import { Board } from '../../components/board/Board';
import { useGameStateContext } from '../../contexts/gameStateContext';
import '../globalRoom/GlobalRoom.scss';
import './Room.scss';
import { useMyTurnContext } from '../../contexts';


export const Room: React.FC = () => {
    const { nickname, setNickname } = useNicknameContext()
    const { roomId } = useParams<string>();
    const [stages, setStages] = useState<number>(0);
    const { pathname } = useLocation()
    const navigate = useNavigate();
    const {
        playersGameState,
        addUsers
    } = useGameStateContext();
    const { setIsStating, myTurn, isStarting, setMyTurn } = useMyTurnContext();

    const invitation = `רוצה להזמין אותך למשחק! ${nickname} -
    העתיקו את הקישור והתחילו לשחק!
    
    http://localhost:5173${pathname}
    `

    useEffect(() => {
        if (!socket) return;
        const handleOpponentLeft = () => {
            alert('Your opponent has left the game.');
            navigate('/');
        };

        socket.on('opponent-left', handleOpponentLeft);

        // Cleanup on unmount
        return () => {
            socket.off('opponent-left', handleOpponentLeft);
        };
    }, []);


    useEffect(() => {
        !nickname && roomId && checkIfRoomExists()
    }, [nickname])

    useEffect(() => {
        if (playersGameState) {
            setStages(3)
        }
    }, [myTurn, isStarting, playersGameState])

    useEffect(() => {
        socket.on('entered-room', (data: string[]) => {
            addUsers(data)
            if (data.length === 2) {
                socket.emit("randomize-turn", { data, roomId });
            }
        });

        return () => {
            socket.off('entered-room')
        }
    }, [stages])

    useEffect(() => {
        socket.on("turn-start", ({ starter }) => {
            setMyTurn(starter === nickname)
            setIsStating(starter === nickname)
        });
        return () => {
            socket.off('randomize-turn')
        }
    }, [nickname])


    const enterRoom = () => {
        if (nickname) {
            socket.emit('entered-room', { roomId, nickname }, (data: string[]) => {
                data.length === 2 && addUsers(data)
            })
            setStages(2);
        }
    }

    const checkIfRoomExists = () => {
        socket.emit('join-room', { roomId }, (roomExists: boolean) => {
            if (!roomExists) {
                alert("The room does not exist.");
                navigate("/");
            } else {
                setStages(1);
            }
        });
    };

    const handleGoBackButton = () => {
        socket.emit('leave-room', { roomId }, (data: boolean) => {
            console.log('data: ', data);
            navigate('/');
        });
    };

    return (
        <div className="room-container">
            <Button className="go-back-btn" id="back" onClick={handleGoBackButton}>Go Back</Button>
            {!stages ?
                <div style={{ height: "100vh", width: "100vw", backgroundColor: "black" }} >
                    <h1 color='yellow'>ROOM NOT EXISTS</h1>
                </div> :
                stages === 1 ?
                    <div className="global-room-container ">
                        <div className="global-room-card">
                            <label>
                                Nickname:
                                <input value={nickname} required type="text" name="nickname" onChange={(e) => setNickname(e.target.value)} />
                            </label>
                            <Button type='submit' disabled={!nickname} className="go-back-btn" onClick={enterRoom}>submit</Button>
                        </div>
                    </div> :
                    stages === 2 ?
                        <Loading contentToCopy={invitation} buttonText={roomId} />
                        :
                        <>
                            <Board />
                        </>
            }
        </div >
    );
};
