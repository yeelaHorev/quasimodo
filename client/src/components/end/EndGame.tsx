import React from 'react';
import './EndGame.scss'; // Import the SCSS file

interface EndGameProps {
  winnerName: string;
  onPlayAgain: () => void;
}

const EndGame: React.FC<EndGameProps> = ({ winnerName, onPlayAgain }) => {
  return (
    <div className="end-game-wrapper">
      <h2 className="winner-message">Game Over</h2>
      <p className="winner-name">{winnerName} Wins!</p>
      <button className="play-again-button" onClick={onPlayAgain}>Play Again</button>
    </div>
  );
};

export default EndGame;
