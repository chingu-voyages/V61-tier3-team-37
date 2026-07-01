import React, { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { KeyboardWrapper } from "../components/keyboard";

const MyComponent = () => {
    const [input, setInput] = useState("");
    const keyboard = useRef<any>(null);

    const onChangeInput = (event: ChangeEvent<HTMLInputElement>): void => {
        const input = event.target.value;
        setInput(input);
        if (keyboard.current) {
            keyboard.current.setInput(input);
        }
    };

    return (
        <div>
            <input
                value={input}
                placeholder={"Tap on the virtual keyboard to start"}
                onChange={e => onChangeInput(e)}
            />
            <KeyboardWrapper keyboardRef={(r: any) => (keyboard.current = r)} onChange={setInput} />
        </div>
    );
};

export default MyComponent;