from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count

from .models import DIFFICULTY_CHOICES, CHARACTER_TYPE_CHOICES
from .serializers import SolveRecordSerializer


class Achievements(APIView):

    def get(self, request):
        records = request.user.solve_records.all()

        by_difficulty = {value: 0 for value, label in DIFFICULTY_CHOICES}
        by_type = {value: 0 for value, label in CHARACTER_TYPE_CHOICES}

        for row in records.values("difficulty").annotate(count=Count("id")):
            if row["difficulty"] in by_difficulty:
                by_difficulty[row["difficulty"]] = row["count"]

        for row in records.values("character_type").annotate(count=Count("id")):
            if row["character_type"] in by_type:
                by_type[row["character_type"]] = row["count"]

        return Response({
            "total": records.count(),
            "by_difficulty": by_difficulty,
            "by_type": by_type,
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SolveRecordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
