from django.db import models
from django.contrib.auth.models import User
import uuid
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.timezone import now


# User Profile model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_picture = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


# Template model
class Template(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    layout = models.JSONField()  # JSON for placeholders, styles, etc.
    preview_image_url = models.URLField()  # Preview image of the template
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# Project model
class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_public = models.BooleanField(default=False)
    xml_content = models.TextField(blank=True, null=True)
    is_favorite = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


# Slide model
class Slide(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="slides"
    )
    template = models.ForeignKey(
        Template, on_delete=models.SET_NULL, null=True, blank=True
    )
    slide_number = models.PositiveIntegerField()  # Order in the project
    content = models.JSONField()  # Content of the slide (title, body, images, etc.)
    xml_content = models.TextField(blank=True, null=True)  # Store XML for this slide
    layout_type = models.CharField(max_length=50, blank=True, null=True)  # Layout type
    section_layout = models.CharField(max_length=20, default="left")  # left, right, vertical
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    img_url = models.URLField(blank=True, null=True)
    dominant_color = models.CharField(
        max_length=7, blank=True, null=True, default="#ffdbac"
    )

    class Meta:
        ordering = ["slide_number"]  # Ensure slides are always ordered by their number

    def __str__(self):
        return f"Slide {self.slide_number} in {self.project.title}"


@receiver(post_save, sender=Slide)
@receiver(post_delete, sender=Slide)
def update_project_timestamp(sender, instance, **kwargs):
    # Update the associated project's updated_at field
    project = instance.project
    project.updated_at = now()
    project.save()


# Shared Project model
class SharedProject(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="shared_projects"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="shared_projects"
    )
    ROLE_CHOICES = [
        ("viewer", "Viewer"),
        ("editor", "Editor"),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="viewer")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.project.title} ({self.role})"
