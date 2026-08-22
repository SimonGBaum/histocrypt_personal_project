from django.urls import path
from .views import FavoriteList, FavoriteDetail

urlpatterns = [
    path('', FavoriteList.as_view()),
    path('<int:id>/', FavoriteDetail.as_view()),
]
