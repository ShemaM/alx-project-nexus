from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import Opportunity, Partner, Subscription, Category


class PartnerSerializer(serializers.ModelSerializer):
    """Serializer for Partner model with opportunity count."""
    opportunity_count = serializers.ReadOnlyField()

    class Meta:
        model = Partner
        fields = ['id', 'name', 'website', 'logo', 'is_featured', 'is_active', 'opportunity_count']


class OpportunitySerializer(serializers.ModelSerializer):
    """Serializer for Opportunity model with slug support."""
    organization = PartnerSerializer(read_only=True)
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Partner.objects.all(),
        source='organization',
        write_only=True,
        required=False
    )
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = Opportunity
        fields = [
            'id', 'title', 'slug', 'organization', 'organization_id', 'organization_name',
            'category', 'deadline', 'description', 'is_verified', 'is_featured',
            'is_active', 'location', 'apply_link', 'created_at', 'updated_at',
            'title_en', 'title_sw', 'title_fr',
            'description_en', 'description_sw', 'description_fr'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']


class OpportunityListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for opportunity listings."""
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = Opportunity
        fields = [
            'id', 'title', 'slug', 'organization_name', 'category',
            'deadline', 'is_verified', 'is_featured', 'location', 'created_at'
        ]


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for email subscriptions."""
    class Meta:
        model = Subscription
        fields = ['id', 'email', 'is_active', 'created_at', 'confirmed_at']
        read_only_fields = ['id', 'is_active', 'created_at', 'confirmed_at']

    def validate_email(self, value):
        """Normalize email to lowercase."""
        return value.lower().strip()


class SubscriptionCreateSerializer(serializers.Serializer):
    """Serializer for creating new subscriptions."""
    email = serializers.EmailField()

    def validate_email(self, value):
        """Normalize email to lowercase."""
        return value.lower().strip()


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model with opportunity count."""
    opportunity_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'color', 'order',
            'is_active', 'opportunity_count',
            'name_en', 'name_sw', 'name_fr',
            'description_en', 'description_sw', 'description_fr'
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with password hashing."""
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate_email(self, value):
        """Normalize email to lowercase and check uniqueness."""
        value = value.lower().strip()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        """Normalize username to lowercase."""
        return value.lower().strip()

    def create(self, validated_data):
        """Create user with hashed password."""
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['email'] = validated_data['email'].lower().strip()
        return super().create(validated_data)


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_username(self, value):
        """Normalize username/email to lowercase."""
        return value.lower().strip()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile data."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active']
        read_only_fields = ['id', 'is_staff', 'is_active']
