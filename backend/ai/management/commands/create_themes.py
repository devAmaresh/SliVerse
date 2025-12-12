from django.core.management.base import BaseCommand
from ai.models import Theme


class Command(BaseCommand):
    help = 'Create default slide themes'

    def handle(self, *args, **options):
        default_themes = [
            {
                "name": "dark",
                "display_name": "Dark",
                "description": "Classic dark theme with white text",
                "background_color": "#1a1a1a",
                "text_color": "#ffffff",
                "accent_color": "#667eea",
                "accent_color_2": "#ff6b6b",
                "accent_color_3": "#51cf66",
            },
            {
                "name": "light",
                "display_name": "Light",
                "description": "Bright light theme with dark text",
                "background_color": "#ffffff",
                "text_color": "#1a1a1a",
                "accent_color": "#667eea",
                "accent_color_2": "#ff6b6b",
                "accent_color_3": "#51cf66",
            },
            {
                "name": "professional",
                "display_name": "Professional",
                "description": "Professional blue and gray theme",
                "background_color": "#f5f5f5",
                "text_color": "#2c3e50",
                "accent_color": "#3498db",
                "accent_color_2": "#2980b9",
                "accent_color_3": "#27ae60",
            },
            {
                "name": "vibrant",
                "display_name": "Vibrant",
                "description": "Colorful vibrant theme",
                "background_color": "#1a1a2e",
                "text_color": "#eaeaea",
                "accent_color": "#00d4ff",
                "accent_color_2": "#ff006e",
                "accent_color_3": "#ffbe0b",
                "gradient_start": "#1a1a2e",
                "gradient_end": "#16213e",
            },
            {
                "name": "ocean",
                "display_name": "Ocean",
                "description": "Cool ocean blues and teals",
                "background_color": "#0f1419",
                "text_color": "#e0f7ff",
                "accent_color": "#00d9ff",
                "accent_color_2": "#0096c7",
                "accent_color_3": "#06aed5",
                "gradient_start": "#0f1419",
                "gradient_end": "#003d5c",
            },
            {
                "name": "sunset",
                "display_name": "Sunset",
                "description": "Warm sunset orange and pink",
                "background_color": "#1a0f0f",
                "text_color": "#ffe8d6",
                "accent_color": "#ff6b35",
                "accent_color_2": "#f7931e",
                "accent_color_3": "#ffa500",
                "gradient_start": "#1a0f0f",
                "gradient_end": "#4a0e0e",
            },
            {
                "name": "forest",
                "display_name": "Forest",
                "description": "Natural forest green theme",
                "background_color": "#0d2818",
                "text_color": "#d4f1d4",
                "accent_color": "#2d6a4f",
                "accent_color_2": "#40916c",
                "accent_color_3": "#52b788",
            },
            {
                "name": "midnight",
                "display_name": "Midnight",
                "description": "Deep midnight purple",
                "background_color": "#0a0e27",
                "text_color": "#e0d5ff",
                "accent_color": "#7c3aed",
                "accent_color_2": "#a78bfa",
                "accent_color_3": "#c4b5fd",
            },
            {
                "name": "minimal",
                "display_name": "Minimal",
                "description": "Minimal black and white",
                "background_color": "#fafafa",
                "text_color": "#000000",
                "accent_color": "#666666",
                "accent_color_2": "#333333",
                "accent_color_3": "#999999",
            },
            {
                "name": "cyberpunk",
                "display_name": "Cyberpunk",
                "description": "Futuristic cyberpunk neon",
                "background_color": "#0d0221",
                "text_color": "#00f0ff",
                "accent_color": "#ff006e",
                "accent_color_2": "#00f0ff",
                "accent_color_3": "#ffbe0b",
                "gradient_start": "#0d0221",
                "gradient_end": "#3a0061",
            },
        ]

        created_count = 0
        updated_count = 0

        for theme_data in default_themes:
            theme, created = Theme.objects.get_or_create(
                name=theme_data["name"],
                defaults=theme_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created theme: {theme.display_name}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'~ Theme already exists: {theme.display_name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Successfully created {created_count} new themes!')
        )
        if updated_count > 0:
            self.stdout.write(
                self.style.WARNING(f'~ {updated_count} themes already existed')
            )
