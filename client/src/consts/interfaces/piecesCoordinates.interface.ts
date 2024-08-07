export interface PieceCoordinates extends selectedPlayerPosition {
    color: string;
    isStarting?: boolean;
}

export interface selectedPlayerPosition {
    col: number;
    row: number;
}