from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from django.db.models import Q

from .serializers import FavoriteSerializer


class FavoriteList(APIView):

    def get(self, request):
        favorites = request.user.favorites.all()
        search = request.query_params.get("search")

        if search:
            favorites = favorites.filter(
                Q(quote_text__icontains=search)
                | Q(author__icontains=search)
                | Q(note__icontains=search)
            )

        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FavoriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.save(user=request.user)
        except IntegrityError:
            return Response(
                {"detail": "You have already saved this quote."},
                status=status.HTTP_400_BAD_REQUEST
            )

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

        try:
            serializer.save()
        except IntegrityError:
            return Response(
                {"detail": "You have already saved this quote."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, id):
        favorite = self.get_favorite(request, id)
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
