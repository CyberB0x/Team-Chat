from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Admin registration for CustomUser.
    Extend the default UserAdmin to display extra fields.
    """
    model = CustomUser
    list_display = ("username", "email", "is_online", "is_staff")
    fieldsets = UserAdmin.fieldsets + (
        ("Additional Info", {"fields": ("avatar", "bio", "is_online")}),
    )
