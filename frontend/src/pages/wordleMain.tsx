import React, { useEffect, useRef, useState } from "react";
import { KeyboardWrapper } from "../components/keyboard";
import Grid from "../components/basicGrid";
import { useKeyboard } from "../hooks/useKeyboard";
import { wordleApi } from "../services/wordleService";
import type { Tile, TileColor } from "../types/word";

const MAX_GUESSES = 6;
const MAX_LENGTH = 5;

const createEmptyGuesses = (): Tile[][] => Array.from({ length: MAX_GUESSES }, () => []);

const normalizeStatus = (status: string): TileColor => {
    if (status === "green") return "green";
    if (status === "yellow") return "yellow";
    return "grey";
};

const WordleMain = () => {
    const [currentGuess, setCurrentGuess] = useState("");
    const [guesses, setGuesses] = useState<Tile[][]>(createEmptyGuesses());
    const [turn, setTurn] = useState(0);
    const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [keyboard, setKeyboard] = useState<any>(null);
    const currentGuessRef = useRef(currentGuess);

    useEffect(() => {
        currentGuessRef.current = currentGuess;
    }, [currentGuess]);

    const handleKeyboardInput = (value: string) => {
        const normalized = value.toUpperCase().slice(0, MAX_LENGTH);
        currentGuessRef.current = normalized;
        setCurrentGuess(normalized);
    };

    const handleKeyPress = (button: string) => {
        if (button === "Enter") {
            void submitGuess();
            return;
        }

        if (button === "Backspace") {
            setCurrentGuess((prev) => prev.slice(0, -1));
            return;
        }

        if (/^[A-Za-z]$/.test(button)) {
            setCurrentGuess((prev) => (prev.length < MAX_LENGTH ? prev + button.toUpperCase() : prev));
        }
    };

    const handlePhysicalKey = (key: string) => {
        if (key === "Enter") {
            void submitGuess();
            return;
        }

        if (key === "Backspace") {
            setCurrentGuess((prev) => prev.slice(0, -1));
            return;
        }

        if (/^[A-Za-z]$/.test(key)) {
            setCurrentGuess((prev) => (prev.length < MAX_LENGTH ? prev + key.toUpperCase() : prev));
        }
    };

    useKeyboard(handlePhysicalKey, gameState === "playing");

    const submitGuess = async () => {
        const normalizedGuess = currentGuessRef.current.trim().toUpperCase();

        if (normalizedGuess.length !== MAX_LENGTH) {
            setMessage("Enter a 5-letter guess.");
            return;
        }

        if (gameState !== "playing") {
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await wordleApi.submitGuess(normalizedGuess);
            const nextGuess = response.feedback.map((letter) => ({
                key: letter.letter.toUpperCase(),
                color: normalizeStatus(letter.status),
            }));

            const nextGuesses = [...guesses];
            nextGuesses[turn] = nextGuess;
            setGuesses(nextGuesses);

            if (response.won) {
                setGameState("won");
                setMessage("You got it!");
            } else if (turn + 1 >= MAX_GUESSES) {
                setGameState("lost");
                setMessage("No more guesses left.");
            } else {
                setTurn((prev) => prev + 1);
            }

            setCurrentGuess("");
            if (keyboard) {
                keyboard.setInput("");
            }
        } catch (error) {
            console.error("Could not submit guess", error);
            setMessage("The guess could not be validated. Try another word.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="wordle-page">
            <div className="game-container">
                <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
                <p>{isLoading ? "Checking guess..." : message ?? (gameState === "won" ? "You solved it!" : gameState === "lost" ? "Try again tomorrow." : "Type or tap a 5-letter word.")}</p>
                <KeyboardWrapper
                    keyboardRef={(r: any) => setKeyboard(r)}
                    onChange={handleKeyboardInput}
                    onKeyPress={handleKeyPress}
                />
            </div>
        </div>
    );
};

export default WordleMain;