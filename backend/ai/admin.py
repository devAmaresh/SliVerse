from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile, Template, Project, Slide, SharedProject, Theme

# Inline UserProfile Admin
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "Profile"

# Theme Admin
class ThemeAdmin(admin.ModelAdmin):
    list_display = ["display_name", "name", "is_active", "created_at"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["name", "display_name"]
    readonly_fields = ["created_at"]
    fieldsets = (
        ("Basic Information", {
            "fields": ("name", "display_name", "description", "is_active")
        }),
        ("Colors", {
            "fields": ("background_color", "text_color", "accent_color", "accent_color_2", "accent_color_3")
        }),
        ("Gradients", {
            "fields": ("gradient_start", "gradient_end"),
            "classes": ("collapse",)
        }),
        ("Media & Metadata", {
            "fields": ("preview_image_url", "created_at"),
            "classes": ("collapse",)
        }),
    )

# Extend UserAdmin to include UserProfile
class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)

# Unregister the default User admin and register the customized one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Register other models
admin.site.register(Template)
admin.site.register(Theme, ThemeAdmin)
admin.site.register(Project)
admin.site.register(Slide)
admin.site.register(SharedProject)
