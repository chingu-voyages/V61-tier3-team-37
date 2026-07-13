
export interface WordResponse {
    date: string;
    status: string;
}

export type LetterStatus = "green" | "yellow" | "gray";
export type TileColor = "green" | "yellow" | "grey";

export interface LetterFeedback {
    letter: string;
    status: LetterStatus;
}

export interface GuessResponse {
    feedback: LetterFeedback[];
    won: boolean;
}

export interface WordGuess {
    guess: string;
}

export interface Tile {
    key: string;
    color: TileColor;
}