from requests import Response
from rest_framework import generics, permissions, status

from . models import Profile
from .serializers import ProfileSerializer, ProfileUpdateSerializer, AvatarUpdateSerializer, FreeProfileSerializer


class ProfileDetailView(generics.RetrieveAPIView):
    # Профиль пользователя
    permission_classes = [permissions.IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'user_id'

class FreeProfileView(generics.RetrieveAPIView):
    # Профиль пользователя
    permission_classes = [permissions.AllowAny]
    queryset = Profile.objects.all()
    serializer_class = FreeProfileSerializer
    lookup_field = 'user_id'

class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    # Редактирование профиля пользователя
    permission_classes = [permissions.IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileUpdateSerializer
    lookup_field = 'user_id'
    # def update(self, request, *args, **kwargs):
    #     if request.method == 'PUT':
    #         try:
    #             request.profile.avatar.delete()
    #             request.profile.save()
    #             return Response
    #         except Exception as e:
    #             return Response(dict(error=str(e)), status=status.HTTP_400_BAD_REQUEST)


class AvatarUpdateView(generics.UpdateAPIView):
    # Редактирование аватара профиля пользователя
    permission_classes = [permissions.IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = AvatarUpdateSerializer