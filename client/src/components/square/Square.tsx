import React from 'react';
import '../board/Board.scss';
import clsx from 'clsx';

// Square component
interface SquareProps {
    color: string;
    onClick?: () => void;
    disabled?: boolean;
    noPlayerSelected?: boolean;
}

export const Square: React.FC<SquareProps> = ({ noPlayerSelected, disabled, color, onClick }) => {

    return (
        <button
            disabled={disabled}
            className={clsx(`square ${color}`, noPlayerSelected && "no-player-selected")}
            onClick={onClick}
        />
    );
};
