from django.urls import path
from .views import GenerateSlideView
from django.urls import include

urlpatterns = [
    path("generate_slide/", GenerateSlideView.as_view(), name="generate_slide"),
]
