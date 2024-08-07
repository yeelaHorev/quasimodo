import { Route, Routes, } from 'react-router';
import './App.css';
import { NicknameProvider } from './contexts/usernameContext';
import { GlobalRoom, Room } from './pages';
import { GameStateProvider } from './contexts/gameStateContext';

function App() {
  return (
    <>
      <NicknameProvider>
        <GameStateProvider>
          <Routes>
            <Route path='/' element={<GlobalRoom />} />
            <Route path='/room/:roomId' element={<Room />} />
          </Routes>
        </GameStateProvider>
      </NicknameProvider>
    </>
  )
}

export default App
