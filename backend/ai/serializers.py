from rest_framework import serializers
from .models import Slide, Project, UserProfile
from django.contrib.auth.models import User


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = [
            "slide_number",
            "content",
            "img_url",
            "id",
        ]  # Include only necessary fields


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "updated_at",
            "is_public",
        ]  # Include only necessary fields


class UserProfileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "profile_picture",
            "created_at",
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileModelSerializer() 

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "profile",  # Nested profile field
        ]
