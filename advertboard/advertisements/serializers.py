 # -- coding: utf-8 --
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField
from .models import Advert, Gallery, Photo, Value, Category, Region, Place, Characteristic, Chat, Message


 # from ..user_profile.serializers import UserSerializer


# class PhotoListSerializer(serializers.ListSerializer):
#     # Фотографии
#
#     def create(self, validated_data):
#         photos = [Photo(**photo) for photo in validated_data]
#         return Photo.objects.bulk_create(photos)

class PhotoSerializer(serializers.ModelSerializer):
    # Фотографии

    class Meta:
        model = Photo
        fields = ('id', 'image', 'gallery')
        # list_serializer_class = PhotoListSerializer



class GallerySerializer(serializers.ModelSerializer):
    # Галереи фотографий

    photos = PhotoSerializer(many=True)

    class Meta:
        model = Gallery
        fields = ("id", "photos", 'advert')

class CategoryParentSerializer(serializers.ModelSerializer):
    # Вывод родительских категорий

    class Meta:
        model = Category
        fields = ("id", "name", "parent", "slug")

class CategoryListSerializer(serializers.ModelSerializer):
    # Вывод категорий

    parent = CategoryParentSerializer()
    children = serializers.ListSerializer(child=RecursiveField())

    class Meta:
        model = Category
        fields = ("id", "name", "parent", "children", "slug")

class CharacteristicSerializer(serializers.ModelSerializer):
    # Характеристики

    categories = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Characteristic
        fields = ("id", "name", "categories")

class ValueSerializer(serializers.ModelSerializer):
    # Значения характеристик

    characteristic = CharacteristicSerializer()
    class Meta:
        model = Value
        fields = "__all__"

class PlaceSerializer(serializers.ModelSerializer):
    # Вывод городов/районов
    class Meta:
        model = Place
        fields = ("id", "city")

class RegionSerializer(serializers.ModelSerializer):
    # Вывод регионов и городов

    places = PlaceSerializer(many=True, read_only=True)
    class Meta:
        model = Region
        fields = ("id", "title", "places")

class AdvertListSerializer(serializers.ModelSerializer):
    # Список объявлений

    # main_photo = serializers.ImageField()
    category = CategoryListSerializer()
    region = serializers.SlugRelatedField(slug_field='title', read_only=True)
    place = serializers.SlugRelatedField(slug_field='city', read_only=True)
    gallery = GallerySerializer()

    class Meta:
        model = Advert
        fields = ('id', 'title', 'category', 'price', 'is_new', 'region', 'place', 'date', 'gallery', 'moderation','user')


class AdvertDetailSerializer(serializers.ModelSerializer):
    # Подробная информация об объявлении

    category = CategoryListSerializer()
    region = RegionSerializer()
    place = PlaceSerializer()
    charvalues = ValueSerializer(many=True)
    gallery = GallerySerializer()
    # user = serializers.SlugRelatedField(slug_field='username', read_only=True)
    class Meta:
        model = Advert
        exclude = ('slug',)


class AdvertCreateSerializer(serializers.ModelSerializer):
    # Добавление объявления

    gallery = serializers.StringRelatedField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Advert
        exclude = ('date', 'moderation', 'slug')

    #def create(self, request):
    #    request['user'] = self.context['request'].user    #
    #     advert = Advert.objects.create(**request)
    #     return advert

    def create(self, validated_data):
        gallery = self.initial_data.get('gallery')
        instance = super().create(validated_data)
        if gallery:
            serializer = GallerySerializer(data=gallery)
            serializer.is_valid(raise_exception=True)
            serializer.save(advert=instance)
        return instance

class AdvertUpdateSerializer(serializers.ModelSerializer):
    # Редактирование объявления

    # gallery = GallerySerializer()

    class Meta:
        model = Advert
        exclude = ('date', 'slug', 'user')

class MessageSerializer(serializers.ModelSerializer):
    # Список сообщений

    pub_date = serializers.DateTimeField(format='%d.%m.%Y, %H:%M')

    class Meta:
        model = Message
        fields = "__all__"

class MessageCreateSerializer(serializers.ModelSerializer):
    # Добавление сообщения

    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Message
        exclude = ('pub_date', 'is_readed')

class ChatSerializer(serializers.ModelSerializer):
    # Вывод бесед

    advert = AdvertListSerializer()
    messages = MessageSerializer(many=True)
    class Meta:
        model = Chat
        fields = ('id', 'advert', 'seller', 'buyer', 'messages')

class ChatCreateSerializer(serializers.ModelSerializer):
    # Добавление беседы

    buyer = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Chat
        exclude = ('slug',)