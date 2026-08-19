from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import SimpleTestCase, TestCase

from .cipher import ALPHABET, build_mapping, encode



class CipherTest(SimpleTestCase):

    def test_01_every_letter_maps_to_a_different_letter(self):
        for _ in range(100):
            mapping = build_mapping()

            self.assertEqual(len(mapping), 26)
            self.assertEqual(sorted(mapping.keys()), sorted(ALPHABET))
            self.assertEqual(len(set(mapping.values())), 26)

            for letter, cipher_letter in mapping.items():
                self.assertNotEqual(letter, cipher_letter)

    def test_02_encoding_keeps_the_same_length_and_spacing(self):
        plaintext = "I LOVE PUZZLES, AND CODE."

        for _ in range(100):
            mapping = build_mapping()
            ciphertext = encode(plaintext, mapping)

            self.assertEqual(len(ciphertext), len(plaintext))

            for index, character in enumerate(plaintext):
                if character in ALPHABET:
                    self.assertIn(ciphertext[index], ALPHABET)
                else:
                    self.assertEqual(ciphertext[index], character)


class PuzzleEndpointTest(TestCase):

    def setUp(self):
        User.objects.create_user(username="tester", password="TestPass2026")
        self.client.post(
            "/api/v1/users/login/",
            {"username": "tester", "password": "TestPass2026"},
            content_type="application/json",
        )

    @patch("game_app.views.get_random_quote")
    def test_03_new_puzzle_returns_a_playable_puzzle(self, mock_quote):
        mock_quote.return_value = {"quote": "I love puzzles.", "author": "Test Author"}

        response = self.client.get("/api/v1/games/new/?difficulty=easy&character_type=alphabetic")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(
            sorted(data.keys()),
            ["author", "character_type", "ciphertext", "difficulty", "length", "prefill", "solution_hash", "tokens"],
        )
        self.assertEqual(len(data["tokens"]), data["length"])
        self.assertEqual(data["author"], "Test Author")
        self.assertNotIn("plaintext", data)

        for index, token in enumerate(data["tokens"]):
            self.assertEqual(sorted(token.keys()), ["index", "input", "token"])
            self.assertEqual(token["index"], index)

        for key in data["prefill"]:
            self.assertTrue(data["tokens"][int(key)]["input"])


    def test_04_a_fourth_saved_game_is_rejected(self):
        body = {
            "ciphertext": "L ORYH SXCCOHV.",
            "plaintext": "I LOVE PUZZLES.",
            "solution_hash": "a" * 64,
            "prefill": {"2": "L"},
            "entries": {},
            "author": "Test Author",
            "difficulty": "easy",
            "character_type": "alphabetic",
        }

        for _ in range(3):
            created = self.client.post(
                "/api/v1/games/saved/", body, content_type="application/json"
            )
            self.assertEqual(created.status_code, 201)

        rejected = self.client.post(
            "/api/v1/games/saved/", body, content_type="application/json"
        )
        self.assertEqual(rejected.status_code, 409)

        listed = self.client.get("/api/v1/games/saved/")
        self.assertEqual(len(listed.json()), 3)


    def test_05_a_user_cannot_reach_another_users_saved_game(self):
        body = {
            "ciphertext": "L ORYH SXCCOHV.",
            "plaintext": "I LOVE PUZZLES.",
            "solution_hash": "a" * 64,
            "prefill": {"2": "L"},
            "entries": {"0": "I"},
            "author": "Test Author",
            "difficulty": "easy",
            "character_type": "alphabetic",
        }
        created = self.client.post(
            "/api/v1/games/saved/", body, content_type="application/json"
        )
        self.assertEqual(created.status_code, 201)
        saved_id = created.json()["id"]

        User.objects.create_user(username="intruder", password="TestPass2026")
        self.client.post(
            "/api/v1/users/login/",
            {"username": "intruder", "password": "TestPass2026"},
            content_type="application/json",
        )

        self.assertEqual(len(self.client.get("/api/v1/games/saved/").json()), 0)
        self.assertEqual(
            self.client.get(f"/api/v1/games/saved/{saved_id}/").status_code, 404
        )
        self.assertEqual(
            self.client.put(
                f"/api/v1/games/saved/{saved_id}/",
                {"entries": {"0": "X"}},
                content_type="application/json",
            ).status_code,
            404,
        )
        self.assertEqual(
            self.client.delete(f"/api/v1/games/saved/{saved_id}/").status_code, 404
        )

        self.client.post(
            "/api/v1/users/login/",
            {"username": "tester", "password": "TestPass2026"},
            content_type="application/json",
        )

        still_there = self.client.get(f"/api/v1/games/saved/{saved_id}/")
        self.assertEqual(still_there.status_code, 200)
        self.assertEqual(still_there.json()["entries"], {"0": "I"})
