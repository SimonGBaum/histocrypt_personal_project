from django.urls import path

from .views import Register, LogIn, Info, Refresh, LogOut

urlpatterns = [
    path('register/', Register.as_view()),
    path('login/', LogIn.as_view()),
    path('info/', Info.as_view()),
    path('refresh/', Refresh.as_view()),
    path('logout/', LogOut.as_view()),
]
