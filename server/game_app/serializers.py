from rest_framework import serializers
from .models import SavedGame
from .cipher import tokenize


class SavedGameSerializer(serializers.ModelSerializer):
    tokens = serializers.SerializerMethodField()
    length = serializers.SerializerMethodField()

    class Meta:
        model = SavedGame
        fields = [
            "id",
            "tokens",
            "ciphertext",
            "plaintext",
            "prefill",
            "entries",
            "author",
            "difficulty",
            "character_type",
            "length",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "ciphertext": {"write_only": True},
            "plaintext": {"required": True, "allow_blank": False},
        }

    def get_tokens(self, obj):
        return tokenize(obj.ciphertext, obj.character_type)

    def get_length(self, obj):
        return len(obj.ciphertext)
