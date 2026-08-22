from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SolveRecordSerializer


class Achievements(APIView):

    def get(self, request):
        records = request.user.solve_records.all()
        by_difficulty = {"easy": 0, "medium": 0, "hard": 0}
        by_type = {"alphabetic": 0, "numeric": 0}
        for record in records:
            if record.difficulty in by_difficulty:
                by_difficulty[record.difficulty] += 1
            if record.character_type in by_type:
                by_type[record.character_type] += 1
        return Response({
            "total": len(records),
            "by_difficulty": by_difficulty,
            "by_type": by_type,
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SolveRecordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
