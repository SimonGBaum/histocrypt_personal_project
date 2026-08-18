from django.urls import path

from .views import NewPuzzle

urlpatterns = [
    path('new/', NewPuzzle.as_view()),
]
