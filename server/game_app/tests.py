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
