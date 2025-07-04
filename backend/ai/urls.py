from django.urls import path
from .views import (
    GenerateXMLPresentationView,
    ProjectsView,
    ProjectsListView,
    GoogleAuthView,
    SlideEditView,
    ProjectRetrieveUpdateDestroyView,
    UserProfileView,
    AddSlideView,
    GenerateSlideTitleView,
    ReorderSlidesView,
    ProjectOutlineView,
)

urlpatterns = [
    # Modern XML-based slide generation (ONLY THIS)
    path('generate-xml-presentation/<str:pk>/', GenerateXMLPresentationView.as_view(), name='generate-xml-presentation'),

    # Project management
    path("generate-outline/", ProjectOutlineView.as_view(), name="generate_outline"),
    path("projects/", ProjectsListView.as_view(), name="projects"),
    path("project/<uuid:project_id>/", ProjectsView.as_view(), name="project_slides"),
    path(
        "projects/<uuid:pk>/",
        ProjectRetrieveUpdateDestroyView.as_view(),
        name="project-update",
    ),

    # Authentication
    path("google-auth/", GoogleAuthView.as_view(), name="google_auth"),

    # Slide management
    path("slide-edit/<int:id>/", SlideEditView.as_view(), name="slide_edit"),
    path("user-profile/", UserProfileView.as_view(), name="user_profile"),
    path(
        "generate-title-slide/",
        GenerateSlideTitleView.as_view(),
        name="generate_title_slide",
    ),
    path("add-slide/<uuid:pk>/", AddSlideView.as_view(), name="add_slide"),
    path(
        "suggest-slide-title/<uuid:pk>/",
        GenerateSlideTitleView.as_view(),
        name="suggest_slide_title",
    ),
    path(
        "project/<uuid:project_id>/reorder-slides/",
        ReorderSlidesView.as_view(),
        name="reorder-slides",
    ),

    # User profile
    path("user-profile/", UserProfileView.as_view(), name="user_profile"),
]
