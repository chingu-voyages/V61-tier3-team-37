import pytest
from game_logic import load_words, get_word_of_day, check_guess
# python3 -m pytest game_logic_test.py -v 2>&1 

# load_words tests
def test_load_words_returns_five_letter_words(tmp_path):
    word_file = tmp_path / "words.txt"
    word_file.write_text("apple\nbanana\ngrape\nkiwi\n")
    result = load_words(str(word_file))
    assert result == ["apple", "grape"]


def test_load_words_filters_non_alpha(tmp_path):
    word_file = tmp_path / "words.txt"
    word_file.write_text("he110\napple\nw0rld\n")
    result = load_words(str(word_file))
    assert result == ["apple"]


def test_load_words_lowercases_words(tmp_path):
    word_file = tmp_path / "words.txt"
    word_file.write_text("APPLE\nGRAPE\n")
    result = load_words(str(word_file))
    assert result == ["apple", "grape"]


def test_load_words_empty_file(tmp_path):
    word_file = tmp_path / "words.txt"
    word_file.write_text("")
    result = load_words(str(word_file))
    assert result == []


def test_load_words_default_file_returns_list():
    result = load_words()
    assert isinstance(result, list)
    assert all(len(w) == 5 and w.isalpha() for w in result)

# get_word_of_day test
def test_get_word_of_day_returns_same_word_for_same_date():
    word_list = ["apple", "grape", "peach"]
    word1 = get_word_of_day(word_list)
    word2 = get_word_of_day(word_list)
    assert word1 == word2

# check_guess tests
def test_check_guess_all_correct():
    result = check_guess("apple", "apple")
    assert all(r["status"] == "green" for r in result)


def test_check_guess_all_grey():
    result = check_guess("bbbbb", "aaaaa")
    assert all(r["status"] == "grey" for r in result)


def test_check_guess_all_yellow():
    # Every letter is in the word but none are in the right position
    # "bcdea" is a rotation of "abcde" — no letter lands on its correct index
    result = check_guess("bcdea", "abcde")
    assert all(r["status"] == "yellow" for r in result)


def test_check_guess_mixed_statuses():
    # 'a' is green (pos 0), 'p' is yellow (in word, wrong pos), rest grey
    result = check_guess("axpyz", "abcpd")
    assert result[0] == {"letter": "a", "status": "green"}
    assert result[2] == {"letter": "p", "status": "yellow"}
    assert result[1]["status"] == "grey"
    assert result[3]["status"] == "grey"
    assert result[4]["status"] == "grey"


def test_check_guess_duplicate_letter_only_one_yellow():
    # Word has one 'p'; guess has two 'p's — only the first should be yellow, second stays grey
    result = check_guess("ppxyz", "abcpd")
    statuses = [r["status"] for r in result]
    assert statuses.count("yellow") == 1
    assert statuses[0] == "yellow"
    assert statuses[1] == "grey"


def test_check_guess_duplicate_letter_green_takes_priority():
    # Word "abpcd" has one 'p' at pos 2; guess "appxx" has 'p' at pos 1 (wrong) and pos 2 (correct)
    # The green at pos 2 consumes the only 'p', so pos 1 stays grey
    result = check_guess("appxx", "abpcd")
    assert result[0] == {"letter": "a", "status": "green"}
    assert result[1] == {"letter": "p", "status": "grey"}
    assert result[2] == {"letter": "p", "status": "green"}


def test_check_guess_is_case_insensitive():
    result = check_guess("APPLE", "apple")
    assert all(r["status"] == "green" for r in result)
    
