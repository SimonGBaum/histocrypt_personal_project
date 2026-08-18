from django.urls import path

from .views import Achievements

urlpatterns = [
    path('', Achievements.as_view()),
]
