export interface LetterFeedback {
  letter: string;
  status: "green" | "yellow" | "grey";
}

export interface GuessResponse {
  feedback: LetterFeedback[];
  won: boolean;
}

export interface WordGuess {
  guess: string;
}

export interface WordResponse {
  date: string;
  status: string;
}
