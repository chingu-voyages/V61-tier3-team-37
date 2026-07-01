import random
from datetime import date

def load_words(filepath="words.txt"):
    with open(filepath) as f:
        return [line.strip().lower() for line in f if len(line.strip()) == 5 and line.strip().isalpha()]

def get_word_of_day(word_list):
    # Seed with today's date so everyone gets the same word
    today = date.today()
    seed = today.year * 10000 + today.month * 100 + today.day
    rng = random.Random(seed)
    return rng.choice(word_list)

def check_guess(guess: str, secret: str):
    guess = guess.lower()
    secret = secret.lower()
    result = []
    secret_counts = {}

    # The two-pass approach handles the tricky case where a letter appears multiple times correctly.

    # Count letters in the secret (for yellow logic)
    for ch in secret:
        secret_counts[ch] = secret_counts.get(ch, 0) + 1

    # First pass: mark greens
    greens = [False] * 5
    for i in range(5):
        if guess[i] == secret[i]:
            result.append({"letter": guess[i], "status": "green"})
            greens[i] = True
            secret_counts[guess[i]] -= 1
        else:
            result.append({"letter": guess[i], "status": "gray"})

    # Second pass: mark yellows
    for i in range(5):
        if not greens[i] and guess[i] in secret_counts and secret_counts[guess[i]] > 0:
            result[i]["status"] = "yellow"
            secret_counts[guess[i]] -= 1

    return result