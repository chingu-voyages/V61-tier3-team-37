import random
from datetime import date

def load_words(filepath="words_of_day.txt"):
    with open(filepath) as f:
        return [line.strip().lower() for line in f if len(line.strip()) == 5 and line.strip().isalpha()]

def get_word_of_day(word_list):
    # Seed with the same number (today's date) so everyone gets the same word
    today = date.today()
    seed = today.year * 10000 + today.month * 100 + today.day #YYYYMMDD format
    rng = random.Random(seed) 
    return rng.choice(word_list)

def check_guess(guess: str, word_of_day: str):
    guess = guess.lower()
    word_of_day = word_of_day.lower()
    result = []
    word_of_day_counts = {}

    # The two-pass approach handles the tricky case where a letter appears multiple times correctly.

    # Count letters in the word_of_day (for yellow logic)
    for ch in word_of_day:
        word_of_day_counts[ch] = word_of_day_counts.get(ch, 0) + 1

    # First pass: mark greens
    greens = [False] * 5
    for i in range(5):
        if guess[i] == word_of_day[i]:
            result.append({"letter": guess[i], "status": "green"})
            greens[i] = True
            word_of_day_counts[guess[i]] -= 1
        else:
            result.append({"letter": guess[i], "status": "grey"}) # can be marked as yellow in the second pass

    # Second pass: mark yellows
    for i in range(5):
        if not greens[i] and guess[i] in word_of_day_counts and word_of_day_counts[guess[i]] > 0:
            result[i]["status"] = "yellow"
            word_of_day_counts[guess[i]] -= 1

    return result