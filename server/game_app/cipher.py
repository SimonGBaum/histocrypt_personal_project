import random
import string


ALPHABET = string.ascii_uppercase

NUMERIC = []

for number in range(1, 27):
    NUMERIC.append(str(number))

DIFFICULTY = {
    "easy": 10,
    "medium": 5,
    "hard": 0,
}

CHARACTER_TYPES = ("alphabetic", "numeric")


def build_mapping():
    shift = random.randint(1, 25)
    mapping = {}
    for position in range(26):
        mapping[ALPHABET[position]] = ALPHABET[(position + shift) % 26]
    return mapping


def encode(plaintext, mapping):
    result = []
    for character in plaintext.upper():
        if character in mapping:
            result.append(mapping[character])
        else:
            result.append(character)
    return "".join(result)


def tokenize(ciphertext, character_type):
    if character_type not in CHARACTER_TYPES:
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
    letter_positions = []
    for index in range(len(upper)):
        if upper[index] in ALPHABET:
            letter_positions.append(index)
    percent = DIFFICULTY[difficulty]
    target = (len(upper) * percent + 99) // 100
    count = min(target, len(letter_positions))
    chosen = random.sample(letter_positions, count)
    prefill = {}
    for index in sorted(chosen):
        prefill[index] = upper[index]
    return prefill


def build_puzzle(plaintext, difficulty, character_type):
    if character_type not in CHARACTER_TYPES:
        raise ValueError(f"Unknown character type: {character_type}")
    plaintext = plaintext.upper()
    mapping = build_mapping()
    ciphertext = encode(plaintext, mapping)
    return {
        "ciphertext": ciphertext,
        "prefill": choose_prefill(plaintext, difficulty),
        "plaintext": plaintext,
        "difficulty": difficulty,
        "character_type": character_type,
        "length": len(plaintext),
    }
