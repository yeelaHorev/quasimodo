import clsx from 'clsx';
import React from 'react';
import './Player.scss';

interface PlayerProps {
  isStarting?: boolean;
  innerCircleColor: string;
  onClick?: () => void;
  disabled?: boolean;
  // myTurn?: boolean;o
  isSelected?: boolean;
}


export const Player: React.FC<PlayerProps> = ({ isSelected, innerCircleColor, onClick, isStarting }) => {
  const outerCircleColor = isStarting ? "black" : "white";

  return (
    <div
      className={clsx("player", isSelected ? "is-selected" : "not-selected")}
    >
      <button
        // disabled={!myTurn}
        className={clsx("circle", isSelected ? "is-selected" : "not-selected")}
        onClick={onClick}
        style={{ borderColor: outerCircleColor, backgroundColor: innerCircleColor }} />
    </div>
  );
};
