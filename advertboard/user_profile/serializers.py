# -- coding: utf-8 --
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class UserSerializer(serializers.ModelSerializer):
    # Сериализация пользователя

    class Meta:
        model = User
        fields = ("id", "username", "email")


class ProfileSerializer(serializers.ModelSerializer):
    # Профиль пользователя
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ("user", "name", "phone", "avatar", "date")
        lookup_field = 'user_id'


class FreeProfileSerializer(serializers.ModelSerializer):
    # Профиль продавца
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ("user", "name", "avatar", "date")
        lookup_field = 'user_id'


class ProfileUpdateSerializer(serializers.ModelSerializer):
    # Редактирование профиля пользователя"""

    class Meta:
        model = Profile
        fields = ("avatar", "phone", "name")


class AvatarUpdateSerializer(serializers.ModelSerializer):
    # Редактирование аватара пользователя
    class Meta:
        model = Profile
        fields = ("avatar",)
