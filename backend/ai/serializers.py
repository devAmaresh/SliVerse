from rest_framework import serializers
from .models import Slide, Project, UserProfile, Theme
from django.contrib.auth.models import User


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = [
            "id",
            "name",
            "display_name",
            "description",
            "background_color",
            "text_color",
            "accent_color",
            "accent_color_2",
            "accent_color_3",
            "gradient_start",
            "gradient_end",
            "preview_image_url",
            "is_active",
        ]


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = [
            "slide_number",
            "content",
            "img_url",
            "id",
            "dominant_color",
            "xml_content",
            "layout_type",
            "section_layout",
        ]  # Include only necessary fields


class ProjectSerializer(serializers.ModelSerializer):
    theme = ThemeSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "updated_at",
            "is_public",
            "xml_content",
            "is_favorite",
            "theme"
        ]  # Include only necessary fields


class ProjectUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating project theme"""
    
    class Meta:
        model = Project
        fields = ["theme"]


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
