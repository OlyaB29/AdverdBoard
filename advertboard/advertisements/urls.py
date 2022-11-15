 # -- coding: utf-8 --
from django.urls import path
from . import views



urlpatterns = [
    path('', views.AdvertListView.as_view()),
    path('adverts/<int:id>', views.AdvertDetailView.as_view()),
    path('create/', views.AdvertCreateView.as_view()),
    path('adverts/', views.UserAdvertListView.as_view()),
    path('update-advert/<int:id>', views.UserAdvertUpdateView.as_view()),
    path('delete-advert/<int:id>', views.UserAdvertDeleteView.as_view()),
    path('categories/', views.CategoryListView.as_view()),
    path('regions/', views.RegionListView.as_view()),
    path('values/', views.ValueListView.as_view()),
    path('create-photo/', views.PhotoCreateView.as_view()),
    path('update-photo/<int:id>', views.PhotoUpdateView.as_view()),
    path('delete-photo/<int:id>', views.PhotoDeleteView.as_view()),
]