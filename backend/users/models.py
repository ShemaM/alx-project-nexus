"""
Custom User Model for BYN-K Platform.

Implements a simple user model with:
- Standard User role for the community
- Admin role for Manasseh (platform administrator)
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model with is_admin role.
    
    - is_admin=True: Admin user (Manasseh) - can manage all listings
    - is_admin=False: Standard community user - can browse and bookmark
    """
    
    is_admin = models.BooleanField(
        default=False,
        help_text="Designates whether this user is a platform administrator."
    )
    
    # Additional profile fields
    bio = models.TextField(
        max_length=500, 
        blank=True, 
        null=True,
        help_text="Short biography (max 500 characters)"
    )
    
    # Notification preferences
    email_notifications = models.BooleanField(
        default=True,
        help_text="Receive email notifications for new opportunities"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({'Admin' if self.is_admin else 'User'})"
    
    @property
    def display_name(self):
        """Return full name if available, otherwise username."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
