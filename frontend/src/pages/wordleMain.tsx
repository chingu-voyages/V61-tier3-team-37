import React, { useRef, useState } from "react";
import { KeyboardWrapper } from "../components/keyboard";
import Grid from "../components/basicGrid";
import { useKeyboard } from "../hooks/useKeyboard";
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

  const syncGuess = (nextGuess: string) => {
    const normalized = nextGuess.toUpperCase().slice(0, 5);
    setInput(normalized);
    setCurrentGuess(normalized);

    if (keyboard.current) {
      keyboard.current.setInput(normalized);
    }
  };

  const handleVirtualKey = (key: string) => {
    if (key === "Enter") {
      void handleSubmit();
      return;
    }

    if (key === "Backspace") {
      syncGuess(currentGuess.slice(0, -1));
      return;
    }

    if (/^[a-zA-Z]$/.test(key)) {
      syncGuess(`${currentGuess}${key}`);
    }
  };

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
      syncGuess("");

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

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    syncGuess(event.target.value);
  };

  useKeyboard((key: string) => {
    if (gameOver) return;

    if (key === "Enter") {
      void handleSubmit();
      return;
    }

    if (key === "Backspace") {
      syncGuess(currentGuess.slice(0, -1));
      return;
    }

    if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 5) {
      syncGuess(`${currentGuess}${key.toUpperCase()}`);
    }
  }, !gameOver);

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
            syncGuess(value);
          }}
          onKeyPress={handleVirtualKey}
        />
      </div>
    </div>
  );
};

export default WordleMain;
