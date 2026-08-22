from django.urls import path
from .views import NewPuzzle, SavedGameList, SavedGameDetail

urlpatterns = [
    path('new/', NewPuzzle.as_view()),
    path('saved/', SavedGameList.as_view()),
    path('saved/<int:id>/', SavedGameDetail.as_view()),
]
