import random
import string


ALPHABET = string.ascii_uppercase

NUMERIC = [str(number) for number in range(1, 27)]


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

