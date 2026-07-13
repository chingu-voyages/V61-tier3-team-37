import React, { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { KeyboardWrapper } from "../components/keyboard";
import Grid from "../components/basicGrid";
import { wordleApi } from "../services/wordleService";

const blankGuesses: { color: string; key: string }[][] = [
  [],
  [],
  [],
  [],
  [],
  [],
];

const WordleMain = () => {
  const [input, setInput] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState(blankGuesses);
  const [turn, setTurn] = useState(0);
  const [gameOver, setGameOver] = useState<"won" | "lost" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const keyboard = useRef<any>(null);

  const handleSubmit = async () => {
    if (currentGuess.length !== 5 || turn >= 6 || gameOver) return;

    setErrorMessage(null);

    try {
      const result = await wordleApi.submitGuess({
        guess: currentGuess.toLowerCase(),
      });

      const newGuess = result.feedback.map((f) => ({
        key: f.letter,
        color: f.status,
      }));

      const newGuesses = [...guesses];
      newGuesses[turn] = newGuess;
      const nextTurn = turn + 1;

      setGuesses(newGuesses);
      setTurn(nextTurn);
      setInput("");
      setCurrentGuess("");
      if (keyboard.current) {
        keyboard.current.clearInput();
      }

      if (result.won) {
        setGameOver("won");
      } else if (nextTurn >= 6) {
        setGameOver("lost");
      }
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setErrorMessage(detail ?? "Something went wrong. Please try again.");
    }
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value.toUpperCase().slice(0, 5);
    setInput(value);
    setCurrentGuess(value);
    if (keyboard.current) {
      keyboard.current.setInput(value);
    }
  };

  return (
    <div className="wordle-page">
      <div className="game-container">
        {gameOver === "won" && (
          <p style={{ color: "green", fontWeight: "bold" }}>You got it!</p>
        )}
        {gameOver === "lost" && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Better luck tomorrow!
          </p>
        )}
        {errorMessage && (
          <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
        )}
        {!gameOver && (
          <input
            value={input}
            placeholder="Type a guess or use the virtual keyboard"
            onChange={onChangeInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        )}
        <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
        <KeyboardWrapper
          keyboardRef={(r: any) => (keyboard.current = r)}
          onChange={(value: string) => {
            const normalized = value.toUpperCase().slice(0, 5);
            setInput(normalized);
            setCurrentGuess(normalized);
          }}
          onEnter={handleSubmit}
        />
      </div>
    </div>
  );
};

export default WordleMain;
