from rest_framework import serializers
from .models import Slide


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = ["slide_number", "content"]  # Include only necessary fields
