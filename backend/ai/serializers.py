from rest_framework import serializers
from .models import Slide, Project


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = ["slide_number", "content","img_url"]  # Include only necessary fields


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ["id", "title", "description","updated_at"]  # Include only necessary fields
