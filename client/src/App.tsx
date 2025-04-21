import { Route, Routes, } from 'react-router';
import './App.css';
import { GlobalRoom, Room } from './pages';
import { GameStateProvider, IsMyTurnProvider, NicknameProvider } from './contexts';

function App() {
  return (
    <>
      <NicknameProvider>
        <IsMyTurnProvider>
        <GameStateProvider>
          <Routes>
            <Route path='/' element={<GlobalRoom />} />
            <Route path='/room/:roomId' element={<Room />} />
          </Routes>
        </GameStateProvider>
        </IsMyTurnProvider>
      </NicknameProvider>
    </>
  )
}

export default App
