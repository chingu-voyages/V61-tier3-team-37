import React, { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { KeyboardWrapper } from "../components/keyboard";
import Grid from "../components/basicGrid";

const blankGuesses: { color: string; key: string }[][] = [[], [], [], [], [], []];

const WordleMain = () => {
    const [input, setInput] = useState("");
    const [currentGuess, setCurrentGuess] = useState("");
    const [guesses] = useState(blankGuesses);
    const [turn] = useState(0);
    const keyboard = useRef<any>(null);

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
                <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
                <KeyboardWrapper
                    keyboardRef={(r: any) => (keyboard.current = r)}
                    onChange={(value: string) => {
                        const normalized = value.toUpperCase().slice(0, 5);
                        setInput(normalized);
                        setCurrentGuess(normalized);
                    }}
                />
            </div>
        </div>
    );
};

export default WordleMain;