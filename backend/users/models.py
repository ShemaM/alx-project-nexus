"""
Custom User Model for BYN-K Platform.

Implements a simple user model with:
- Standard User role for the community
- Admin role for Manasseh (platform administrator)
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from listings.models import Subscription


class User(AbstractUser):
    """
    Custom User model with legacy is_admin flag.
    Platform management is enforced via Django superuser status.
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


class UpdateSubscriber(Subscription):
    """
    Proxy model to expose update-only subscribers under the Users domain
    in Django admin navigation.
    """

    class Meta:
        proxy = True
        app_label = 'users'
        verbose_name = 'Update Subscriber'
        verbose_name_plural = 'Update Subscribers'


class SignedUpUser(User):
    """
    Proxy model to present account holders under a clear admin category.
    """

    class Meta:
        proxy = True
        app_label = 'users'
        verbose_name = 'Signed Up User'
        verbose_name_plural = 'Signed Up Users'
