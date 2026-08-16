from django.urls import path

from .views import Register, LogIn, Info

urlpatterns = [
    path('register/', Register.as_view()),
    path('login/', LogIn.as_view()),
    path('info/', Info.as_view()),
]
