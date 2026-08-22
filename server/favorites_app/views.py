from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import FavoriteSerializer


class FavoriteList(APIView):

    def get(self, request):
        favorites = request.user.favorites.all()
        search = request.query_params.get("search")
        term = search.lower()
        matches = []
        for favorite in favorites:
            if (term in favorite.quote_text.lower() or term in favorite.author.lower() or term in favorite.note.lower()):
                matches.append(favorite)
        favorites = matches
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FavoriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quote_text = serializer.validated_data["quote_text"]
        if request.user.favorites.filter(quote_text=quote_text).exists():
            return Response(
                {"detail": "You have already saved this quote."},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FavoriteDetail(APIView):

    def get_favorite(self, request, id):
        return get_object_or_404(request.user.favorites, id=id)

    def get(self, request, id):
        favorite = self.get_favorite(request, id)
        serializer = FavoriteSerializer(favorite)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        favorite = self.get_favorite(request, id)
        serializer = FavoriteSerializer(favorite, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, id):
        favorite = self.get_favorite(request, id)
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
