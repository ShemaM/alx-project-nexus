"""
User Serializers.
"""

from rest_framework import serializers
from .models import User
from allauth.socialaccount.models import SocialAccount


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    display_name = serializers.CharField(read_only=True)
    social_avatar_url = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()

    def get_social_avatar_url(self, obj):
        social = SocialAccount.objects.filter(user=obj).first()
        if not social:
            return None

        extra = social.extra_data or {}
        return (
            extra.get('picture')
            or extra.get('profilePicture')
            or extra.get('avatar_url')
            or extra.get('pictureUrl')
        )

    def get_roles(self, obj):
        """
        Normalized role identifiers used by the frontend RBAC checks.
        """
        roles = {name.strip().lower() for name in obj.groups.values_list('name', flat=True) if name}

        if obj.is_superuser:
            roles.add('super_admin')
        elif obj.is_staff:
            roles.add('staff')

        return sorted(roles)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'display_name', 'bio', 'is_admin', 'is_staff', 'is_superuser',
            'roles', 'email_notifications', 'date_joined', 'social_avatar_url'
        ]
        read_only_fields = ['id', 'is_admin', 'is_staff', 'is_superuser', 'roles', 'date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
