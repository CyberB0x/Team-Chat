from django.contrib.auth.models import AbstractUser
from django.db import models

def user_avatar_path(instance, filename):
    """
    Return a file path for a user's avatar upload.
    Example: avatars/user_1/avatar.png
    """
    # User instance.pk or instance.id; pk may be None before save
    return f"avatar/user_{instance.id}/{filename}"

class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser
    Add avatar, bio and online status fields.
    """
    avatar = models.ImageField(
        upload_to=user_avatar_path,
        blank=True,
        null=True,
        help_text="Profile picture for the user"
    )
    bio = models.TextField(
        blank=True,
        null=True,
        help_text="Short user bio or status"
    )
    is_online = models.BooleanField(
        default=False,
        help_text="Flag to indicate whether user is currently online"
    )

    def __str__(self):
        # Provide a readable representation for admin and shell
        return self.username

