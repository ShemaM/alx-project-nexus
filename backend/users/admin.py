"""
User Admin Configuration.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin
from .models import User, UpdateSubscriber, SignedUpUser


@admin.register(SignedUpUser)
class SignedUpUserAdmin(BaseUserAdmin, ModelAdmin):
    """Custom User admin configuration."""
    
    list_display = ['username', 'email', 'is_superuser', 'is_staff', 'is_active', 'date_joined']
    list_filter = ['is_superuser', 'is_staff', 'is_active', 'date_joined', 'email_notifications']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Platform Settings', {
            'fields': ('is_admin', 'bio', 'email_notifications'),
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Platform Settings', {
            'fields': ('is_admin', 'email_notifications'),
        }),
    )


@admin.register(UpdateSubscriber)
class UpdateSubscriberAdmin(ModelAdmin):
    """Update-only subscribers (no full account required)."""

    list_display = ['email', 'is_active', 'created_at', 'confirmed_at', 'last_notified_at']
    list_filter = ['is_active', 'created_at', 'confirmed_at']
    search_fields = ['email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'confirmed_at', 'last_notified_at']


# Keep admin nav focused: remove technical entries.
try:
    admin.site.unregister(User)
except Exception:
    pass

try:
    from allauth.account.models import EmailAddress
    admin.site.unregister(EmailAddress)
except Exception:
    pass
