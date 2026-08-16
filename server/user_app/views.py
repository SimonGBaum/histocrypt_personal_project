from django.conf import settings
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer
from .authentication import CookieJWTAuthentication


class Register(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogIn(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        response = Response({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "email": user.email,
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
            httponly=True,
            samesite="Lax",
            secure=not settings.DEBUG,
            max_age=int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            samesite="Lax",
            secure=not settings.DEBUG,
            max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
        )

        return response


class UserView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]


class Info(UserView):
    def get(self, request):
        return Response({
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "username": request.user.username,
            "email": request.user.email,
        }, status=status.HTTP_200_OK)

