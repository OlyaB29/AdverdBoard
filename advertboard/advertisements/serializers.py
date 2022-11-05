 # -- coding: utf-8 --
from rest_framework import serializers
from rest_framework_recursive.fields import RecursiveField
from . models import Advert, Gallery, Photo, Value, Category, Region, Place, Characteristic


class PhotoSerializer(serializers.ModelSerializer):
    # Фотографии

    class Meta:
        model = Photo
        fields = ('image',)


class GallerySerializer(serializers.ModelSerializer):
    # Галереи фотографий

    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Gallery
        fields = ("photos",)

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

    main_photo = serializers.ImageField()
    category = CategoryListSerializer()
    region = serializers.SlugRelatedField(slug_field='title', read_only=True)
    place = serializers.SlugRelatedField(slug_field='city', read_only=True)
    gallery = GallerySerializer()

    class Meta:
        model = Advert
        fields = ('id', 'title', 'category', 'price', 'is_new', 'region', 'place', 'main_photo', 'date', 'gallery')


class AdvertDetailSerializer(serializers.ModelSerializer):
    # Подробная информация об объявлении

    category = CategoryListSerializer()
    region = serializers.SlugRelatedField(slug_field='title', read_only=True)
    place = serializers.SlugRelatedField(slug_field='city', read_only=True)
    charvalues = ValueSerializer(many=True)
    gallery = GallerySerializer()
    user = serializers.SlugRelatedField(slug_field='username', read_only=True)
    class Meta:
        model = Advert
        exclude = ('moderation', 'slug')


class AdvertCreateUpdateSerializer(serializers.ModelSerializer):
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