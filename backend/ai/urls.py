from django.urls import path
from .views import GenerateSlideView, ProjectsView
from django.urls import include

urlpatterns = [
    path("generate_slide/", GenerateSlideView.as_view(), name="generate_slide"),
    path("projects/", ProjectsView.as_view(), name="projects"),
]
