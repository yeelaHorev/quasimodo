import clsx from 'clsx';
import React from 'react';
import './Player.scss';

interface PlayerProps {
  isStarting?: boolean;
  innerCircleColor: string;
  onClick?: () => void;
  disabled?: boolean;
  myTurn: boolean;
  isSelected?: boolean;
}


export const Player: React.FC<PlayerProps> = ({ myTurn, isSelected, innerCircleColor, onClick, isStarting }) => {
  console.log("🚀 ~ myTurn:", myTurn)
  const outerCircleColor = isStarting ? "black" : "white";

  return (
    <div
      className={clsx("player", isSelected ? "is-selected" : "not-selected")}
    >
      <button
        disabled={myTurn}
        className={clsx("circle", isSelected ? "is-selected" : "not-selected")}
        onClick={onClick}
        style={{ borderColor: outerCircleColor, backgroundColor: innerCircleColor }} />
    </div>
  );
};
