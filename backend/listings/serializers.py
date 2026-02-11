"""
Listings Serializers.

Updated to align with Next.js TypeScript interfaces and 
Phase 3 Security NFRs (Protected Media & Disclaimers).
"""

from rest_framework import serializers
from django.conf import settings
from .models import Job, ClickAnalytics, Subscription, Partner


class PrepChecklistItemSerializer(serializers.Serializer):
    """Serializer for preparation checklist items."""
    item = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    required = serializers.BooleanField(default=False)


class JobSerializer(serializers.ModelSerializer):
    """
    Full Serializer for Job model details.
    """
    # Aligning with Frontend: Mapping 'organization_name' to 'organization'
    organization = serializers.CharField(source='organization_name', read_only=True)
    
    days_until_deadline = serializers.IntegerField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    brochure_url = serializers.SerializerMethodField()
    disclaimer = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'organization', # Field name expected by transformJobToOpportunityCard
            'organization_name',
            'org_logo', # Add org_logo
            'location',
            'city',
            'category',
            'description',
            # Work mode & commitment
            'work_mode',
            'commitment',
            # Eligibility
            'target_group',
            'education_level',
            # Funding
            'funding_type',
            'is_paid',
            'stipend_min',
            'stipend_max',
            # Documents
            'required_documents',
            # Application
            'application_type',
            'external_url',
            'application_email',
            'email_subject_line',
            'brochure_url',
            'prep_checklist',
            # Status
            'is_verified',
            'is_active',
            'is_featured',
            # Deadline
            'deadline',
            'is_rolling',
            'days_until_deadline',
            'is_expired',
            # Metadata
            'created_at',
            'updated_at',
            'disclaimer',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_brochure_url(self, obj):
        """
        Return the protected URL instead of the direct file link.
        This ensures Phase 3 Security NFRs and click tracking.
        """
        if obj.brochure_upload:
            return f"/api/opportunities/{obj.id}/brochure/"
        return None
    
    def get_disclaimer(self, obj):
        """Return the platform disclaimer from settings."""
        return getattr(settings, 'PLATFORM_DISCLAIMER', "Verified Opportunity.")


class JobListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for job listings cards.
    """
    organization = serializers.CharField(source='organization_name', read_only=True)
    days_until_deadline = serializers.IntegerField(read_only=True)
    brochure_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'organization',
            'org_logo', # Add org_logo
            'location',
            'city',
            'category',
            'description',
            # Work mode & commitment
            'work_mode',
            'commitment',
            # Eligibility
            'target_group',
            'education_level',
            # Funding
            'funding_type',
            'is_paid',
            'stipend_min',
            'stipend_max',
            # Documents
            'required_documents',
            # Application
            'application_type',
            'external_url',
            'application_email',
            'email_subject_line',
            'brochure_url',
            'prep_checklist',
            # Status
            'is_verified',
            # Deadline
            'deadline',
            'is_rolling',
            'days_until_deadline',
        ]
    
    def get_brochure_url(self, obj):
        if obj.brochure_upload:
            return f"/api/opportunities/{obj.id}/brochure/"
        return None


class ClickAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for Click Analytics."""
    class Meta:
        model = ClickAnalytics
        fields = ['id', 'job', 'click_type', 'click_count', 'last_clicked_at']
        read_only_fields = ['id', 'click_count', 'last_clicked_at']


class TrackClickSerializer(serializers.Serializer):
    """Serializer for tracking clicks."""
    job_id = serializers.IntegerField()
    click_type = serializers.ChoiceField(
        choices=['apply', 'view_brochure', 'compose_email', 'view_details']
    )


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for email subscriptions."""
    class Meta:
        model = Subscription
        fields = ['id', 'email', 'is_active', 'created_at', 'confirmed_at']
        read_only_fields = ['id', 'is_active', 'created_at', 'confirmed_at']


class SubscriptionCreateSerializer(serializers.Serializer):
    """Serializer for creating a new subscription."""
    email = serializers.EmailField()
    
    def validate_email(self, value):
        """Validate and normalize email."""
        return value.lower().strip()


class PartnerSerializer(serializers.ModelSerializer):
    """Serializer for partner organizations."""

    opportunity_count = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ['id', 'name', 'logo_url', 'website_url', 'is_featured', 'opportunity_count']
        read_only_fields = ['id', 'opportunity_count']

    def get_opportunity_count(self, obj):
        from .models import Job
        return Job.objects.filter(organization_name=obj.name, is_active=True).count()
    