import hashlib
import math
import random
import string


ALPHABET = string.ascii_uppercase

NUMERIC = [str(number) for number in range(1, 27)]

DIFFICULTY = {
    "easy": 0.10,
    "medium": 0.05,
    "hard": 0.0,
}


def build_mapping():
    letters = list(ALPHABET)
    shuffled = list(ALPHABET)

    while True:
        random.shuffle(shuffled)
        if all(a != b for a, b in zip(letters, shuffled)):
            break

    return dict(zip(letters, shuffled))


def encode(plaintext, mapping):
    result = []

    for character in plaintext.upper():
        if character in mapping:
            result.append(mapping[character])
        else:
            result.append(character)

    return "".join(result)


def render(ciphertext, character_type):
    if character_type == "alphabetic":
        return ciphertext

    if character_type == "numeric":
        tokens = NUMERIC
    else:
        raise ValueError(f"Unknown character type: {character_type}")

    pieces = []

    for character in ciphertext:
        if character in ALPHABET:
            pieces.append(tokens[ALPHABET.index(character)])
        else:
            pieces.append(character)

    return " ".join(pieces)


def tokenize(ciphertext, character_type):
    if character_type not in ("alphabetic", "numeric"):
        raise ValueError(f"Unknown character type: {character_type}")

    tokens = []

    for index, character in enumerate(ciphertext):
        if character in ALPHABET:
            if character_type == "numeric":
                token = NUMERIC[ALPHABET.index(character)]
            else:
                token = character
            tokens.append({"token": token, "input": True, "index": index})
        else:
            tokens.append({"token": character, "input": False, "index": index})

    return tokens


def choose_prefill(plaintext, difficulty):
    if difficulty not in DIFFICULTY:
        raise ValueError(f"Unknown difficulty: {difficulty}")

    upper = plaintext.upper()
    letter_positions = [
        index for index, character in enumerate(upper)
        if character in ALPHABET
    ]

    target = math.ceil(len(upper) * DIFFICULTY[difficulty])
    count = min(target, len(letter_positions))

    chosen = random.sample(letter_positions, count)

    return {index: upper[index] for index in sorted(chosen)}


def solution_hash(plaintext):
    return hashlib.sha256(plaintext.upper().encode("utf-8")).hexdigest()


def build_puzzle(plaintext, difficulty, character_type):
    mapping = build_mapping()
    ciphertext = encode(plaintext, mapping)

    return {
        "ciphertext": ciphertext,
        "display": render(ciphertext, character_type),
        "prefill": choose_prefill(plaintext, difficulty),
        "solution_hash": solution_hash(plaintext),
        "difficulty": difficulty,
        "character_type": character_type,
        "length": len(plaintext),
    }
