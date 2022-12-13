 # -- coding: utf-8 --

from django.urls import path
from . import views


urlpatterns = [
    path("<int:user_id>/", views.ProfileDetailView.as_view()),
    path("free/<int:user_id>/", views.FreeProfileView.as_view()),
    path("update/<int:user_id>/", views.ProfileUpdateView.as_view()),
    path("update/avatar/<int:user_id>/", views.AvatarUpdateView.as_view()),
]