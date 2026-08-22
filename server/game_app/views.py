from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .services import get_random_quote, QuoteUnavailable
from .cipher import build_puzzle, tokenize
from .serializers import SavedGameSerializer


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
            "ciphertext": puzzle["ciphertext"],
            "prefill": puzzle["prefill"],
            "plaintext": puzzle["plaintext"],
            "author": quote["author"],
            "difficulty": difficulty,
            "character_type": character_type,
            "length": puzzle["length"],
        }, status=status.HTTP_200_OK)


class SavedGameList(APIView):

    def get(self, request):
        saved_games = request.user.saved_games.all()
        serializer = SavedGameSerializer(saved_games, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.saved_games.count() >= 3:
            return Response(
                {"detail": "You have 3 saved games. Delete one to save another."},
                status=status.HTTP_409_CONFLICT
            )
        serializer = SavedGameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SavedGameDetail(APIView):

    def get_saved_game(self, request, id):
        return get_object_or_404(request.user.saved_games, id=id)

    def get(self, request, id):
        saved_game = self.get_saved_game(request, id)
        serializer = SavedGameSerializer(saved_game)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        saved_game = self.get_saved_game(request, id)
        serializer = SavedGameSerializer(saved_game, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, id):
        saved_game = self.get_saved_game(request, id)
        saved_game.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
