from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services import get_random_quote, QuoteUnavailable
from .cipher import build_puzzle, tokenize


class NewPuzzle(APIView):

    def get(self, request):
        difficulty = request.query_params.get("difficulty", "medium")
        character_type = request.query_params.get("character_type", "alphabetic")

        try:
            quote = get_random_quote()
        except QuoteUnavailable:
            return Response(
                {"detail": "No puzzle is available right now. Please try again."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        try:
            puzzle = build_puzzle(quote["quote"], difficulty, character_type)
        except ValueError:
            return Response(
                {"detail": "Invalid difficulty or character type."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "tokens": tokenize(puzzle["ciphertext"], character_type),
            "prefill": puzzle["prefill"],
            "solution_hash": puzzle["solution_hash"],
            "author": quote["author"],
            "difficulty": difficulty,
            "character_type": character_type,
            "length": puzzle["length"],
        }, status=status.HTTP_200_OK)
