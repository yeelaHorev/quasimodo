import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { socket } from '../../main';
import './GlobalRoom.scss';
import { Button } from '@mui/material';
import { useMyTurnContext } from '../../contexts';

export const GlobalRoom: React.FC = () => {
    const [roomId, setRoomId] = useState<string>("")
    const { setMyTurn } = useMyTurnContext()

    const navigate = useNavigate()

    const createRoom = () => {
        setMyTurn(true)
        socket.emit('create-room', (roomCode: string) => {
            navigate(`/room/${roomCode}`);
        });
        return () => { socket.off('create-room') }
    }

    const enterRoom = () => {
        navigate(`/room/${roomId}`);
    };


    return (
        <div className='global-room-container'>
            <div className="global-room-card">
                <label>
                    Room id:
                    <input required type="text" name="roomId" onChange={(e) => setRoomId(e.target.value)} />
                </label>
                <Button disabled={!roomId} onClick={enterRoom} >
                    ENTER ROOM
                </Button>
                <Button onClick={createRoom}  >
                    CREATE A ROOM
                </Button>
            </div>
        </div>
    );
};