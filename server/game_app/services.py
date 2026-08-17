import os
import random

import requests


ZENQUOTES_URL = "https://zenquotes.io/api/quotes/"
REQUEST_TIMEOUT = 10

MIN_LENGTH = 50
MAX_LENGTH = 180


class QuoteUnavailable(Exception):
    """Raised when no usable quote could be obtained from ZenQuotes."""
    pass


def get_random_quote():
    api_key = os.environ.get("ZENQUOTES_API_KEY")
    url = f"{ZENQUOTES_URL}{api_key}"

    try:
        response = requests.get(url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        batch = response.json()
    except requests.RequestException:
        raise QuoteUnavailable("Could not reach the quote service.")
    except ValueError:
        raise QuoteUnavailable("The quote service returned an unreadable response.")

    candidates = [
        item for item in batch
        if MIN_LENGTH <= int(item["c"]) <= MAX_LENGTH
    ]

    if not candidates:
        raise QuoteUnavailable("No quote of a usable length was available.")

    chosen = random.choice(candidates)

    return {
        "quote": chosen["q"],
        "author": chosen["a"],
    }

