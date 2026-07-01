from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from game_logic import load_words, get_word_of_day, check_guess

app = FastAPI()

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

WORDS = load_words()

class GuessRequest(BaseModel):
    guess: str

@app.get("/word")
def word_of_the_day():
    return {"word": get_word_of_day(WORDS)}

@app.post("/guess")
def submit_guess(body: GuessRequest):
    if len(body.guess) != 5 or not body.guess.isalpha():
        raise HTTPException(status_code=400, detail="Guess must be a 5-letter word")
    if body.guess.lower() not in WORDS:
        raise HTTPException(status_code=400, detail="Incorrect guess: not in word list")
    secret = get_word_of_day(WORDS)
    feedback = check_guess(body.guess, secret)
    won = all(f["status"] == "green" for f in feedback)
    return {"feedback": feedback, "won": won}