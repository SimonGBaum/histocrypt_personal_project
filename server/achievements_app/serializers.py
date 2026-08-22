from rest_framework import serializers
from .models import SolveRecord


class SolveRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = SolveRecord
        fields = ["id", "difficulty", "character_type", "solved_at"]
        read_only_fields = ["id", "solved_at"]
