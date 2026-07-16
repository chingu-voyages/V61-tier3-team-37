import { useState } from "react";
import { wordleApi } from "../services/wordleService";
import type { GuessResponse, WordGuess } from "../types/word";

type FormattedLetter = {
  key: string;
  color: string;
};

const isValidLetterKey = (key: string) => /^[A-Za-z]$/.test(key);

const useWordle = (solution: string) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState<Array<FormattedLetter[] | null>>([
    ...Array(6),
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<GuessResponse | null>(null);

  const formatGuess = () => {
    const solutionArray: Array<string | null> = [...solution];
    const formattedGuess: FormattedLetter[] = [...currentGuess].map(
      (letter) => ({
        key: letter,
        color: "grey",
      })
    );

    formattedGuess.forEach((letter, index) => {
      if (solution[index] === letter.key) {
        formattedGuess[index].color = "green";
        solutionArray[index] = null;
      }
    });

    formattedGuess.forEach((letter, index) => {
      if (letter.color !== "green" && solutionArray.includes(letter.key)) {
        formattedGuess[index].color = "yellow";
        solutionArray[solutionArray.indexOf(letter.key)] = null;
      }
    });

    return formattedGuess;
  };

  const normalizeResponse = (response: GuessResponse): FormattedLetter[] => {
    if (!response || !Array.isArray(response.feedback)) {
      return [];
    }

    return response.feedback.map((letter) => ({
      key: String(letter.letter),
      color: String(letter.status),
    }));
  };

  const addNewGuess = (formattedGuess: FormattedLetter[]) => {
    if (
      formattedGuess.length === 5 &&
      formattedGuess.every((letter) => letter.color === "green")
    ) {
      setIsCorrect(true);
    }

    setGuesses((prevGuesses) => {
      const newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });

    setHistory((prevHistory) => [...prevHistory, currentGuess]);
    setTurn((prevTurn) => prevTurn + 1);

    setUsedKeys((prevUsedKeys) => {
      const nextUsedKeys = { ...prevUsedKeys };

      formattedGuess.forEach((letter) => {
        const existingColor = nextUsedKeys[letter.key];

        if (letter.color === "green") {
          nextUsedKeys[letter.key] = "green";
          return;
        }

        if (letter.color === "yellow" && existingColor !== "green") {
          nextUsedKeys[letter.key] = "yellow";
          return;
        }

        if (
          letter.color === "grey" &&
          existingColor !== "green" &&
          existingColor !== "yellow"
        ) {
          nextUsedKeys[letter.key] = "grey";
        }
      });

      return nextUsedKeys;
    });

    setCurrentGuess("");
  };

  const submitGuess = async () => {
    if (turn > 5) {
      setError("You used all your guesses.");
      return;
    }

    if (history.includes(currentGuess)) {
      setError("You already tried that word.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await wordleApi.submitGuess({
        guess: currentGuess,
      } satisfies WordGuess);
      setLastResponse(response);

      const formattedResponse = normalizeResponse(response);
      if (formattedResponse.length === 5) {
        addNewGuess(formattedResponse);
      } else {
        addNewGuess(formatGuess());
      }
    } catch (submitError) {
      console.error("Wordle submit error:", submitError);
      setError("Unable to submit guess. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyup = async ({ key }: { key: string }) => {
    if (key === "Enter") {
      await submitGuess();
      return;
    }

    if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (isValidLetterKey(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key.toUpperCase());
      }
    }
  };

  return {
    turn,
    currentGuess,
    guesses,
    isCorrect,
    usedKeys,
    loading,
    error,
    lastResponse,
    handleKeyup,
  };
};

export default useWordle;
