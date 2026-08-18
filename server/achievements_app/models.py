from django.db import models
from django.contrib.auth.models import User


DIFFICULTY_CHOICES = [
    ("easy", "Easy"),
    ("medium", "Medium"),
    ("hard", "Hard"),
]

CHARACTER_TYPE_CHOICES = [
    ("alphabetic", "Alphabetic"),
    ("numeric", "Numeric"),
]


class SolveRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="solve_records")
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    character_type = models.CharField(max_length=10, choices=CHARACTER_TYPE_CHOICES)
    solved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-solved_at"]

    def __str__(self):
        return f"{self.user.username} - {self.difficulty} {self.character_type}"
