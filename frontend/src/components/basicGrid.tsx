import React from 'react'

// components
import Row from './row'

export default function Grid({ guesses, currentGuess, turn }: { guesses: { color: string; key: string }[][]; currentGuess?: string; turn: number }) {
    return (
        <div>
            {guesses.map((g, i) => {
                if (turn === i) {
                    return <Row key={i} currentGuess={currentGuess} />
                }
                return <Row key={i} guess={g} />
            })}
        </div>
    )
}