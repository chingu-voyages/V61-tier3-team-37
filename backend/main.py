from datetime import date
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from game_logic import load_words, get_word_of_day, check_guess

app = FastAPI()

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ANSWERS = load_words()

VALID_GUESSES_PATH = Path(__file__).parent / "valid_guesses.txt"
with open(VALID_GUESSES_PATH) as f:
    VALID_GUESSES = {line.strip().lower() for line in f if len(line.strip()) == 5}


class GuessRequest(BaseModel):
    guess: str


@app.get("/word")
def word_of_the_day():
    get_word_of_day(ANSWERS)  
    return {"date": date.today().isoformat(), "status": "ready"}


@app.post("/guess")
def submit_guess(body: GuessRequest):
    if len(body.guess) != 5 or not body.guess.isalpha():
        raise HTTPException(status_code=400, detail="Guess must be a 5-letter word")
    if body.guess.lower() not in VALID_GUESSES:
        raise HTTPException(status_code=400, detail="Guess must be a valid word")
    word_of_day = get_word_of_day(ANSWERS)
    feedback = check_guess(body.guess, word_of_day)
    won = all(f["status"] == "green" for f in feedback)
    return {"feedback": feedback, "won": won}