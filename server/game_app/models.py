from django.db import models
from django.contrib.auth.models import User


class SavedGame(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saved_games")
    ciphertext = models.TextField()
    plaintext = models.TextField(blank=True, default="")
    solution_hash = models.CharField(max_length=64)
    prefill = models.JSONField()
    entries = models.JSONField(default=dict)
    author = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=10)
    character_type = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.user.username} - {self.author} ({self.difficulty})"
