from django.urls import path
from .views import GenerateSlideView, ProjectsView ,GoogleAuthView
from django.urls import include

urlpatterns = [
    path("generate_slide/", GenerateSlideView.as_view(), name="generate_slide"),
    path("projects/", ProjectsView.as_view(), name="projects"),
    path("project/<int:project_id>/", ProjectsView.as_view(), name="project_slides"),
    path("google-auth/", GoogleAuthView.as_view(), name="google_auth"),
]
