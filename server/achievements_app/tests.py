from django.contrib.auth.models import User
from django.test import TestCase


class AchievementsTest(TestCase):

    def setUp(self):
        User.objects.create_user(username="tester", password="TestPass2026")
        self.client.post(
            "/api/v1/users/login/",
            {"username": "tester", "password": "TestPass2026"},
            content_type="application/json",
        )

    def test_01_counts_are_correct_and_add_up(self):
        empty = self.client.get("/api/v1/achievements/").json()
        self.assertEqual(empty["total"], 0)
        self.assertEqual(empty["by_difficulty"], {"easy": 0, "medium": 0, "hard": 0})
        self.assertEqual(empty["by_type"], {"alphabetic": 0, "numeric": 0})

        solves = [
            ("easy", "alphabetic"),
            ("easy", "alphabetic"),
            ("easy", "numeric"),
            ("medium", "alphabetic"),
            ("hard", "numeric"),
        ]
        for difficulty, character_type in solves:
            recorded = self.client.post(
                "/api/v1/achievements/",
                {"difficulty": difficulty, "character_type": character_type},
                content_type="application/json",
            )
            self.assertEqual(recorded.status_code, 201)

        data = self.client.get("/api/v1/achievements/").json()
        self.assertEqual(data["total"], 5)
        self.assertEqual(data["by_difficulty"], {"easy": 3, "medium": 1, "hard": 1})
        self.assertEqual(data["by_type"], {"alphabetic": 3, "numeric": 2})
        self.assertEqual(sum(data["by_difficulty"].values()), data["total"])
        self.assertEqual(sum(data["by_type"].values()), data["total"])
