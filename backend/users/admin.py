"""
User Admin Configuration.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom User admin configuration."""
    
    list_display = ['username', 'email', 'is_admin', 'is_active', 'date_joined']
    list_filter = ['is_admin', 'is_active', 'is_staff', 'date_joined']
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
