"""
Listings Serializers.
"""

from rest_framework import serializers
from django.conf import settings
from .models import Job, ClickAnalytics


class PrepChecklistItemSerializer(serializers.Serializer):
    """Serializer for preparation checklist items."""
    
    item = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    required = serializers.BooleanField(default=False)


class JobSerializer(serializers.ModelSerializer):
    """
    Serializer for Job model.
    
    Includes the mandatory disclaimer in every response
    as per Phase 3 Security NFRs.
    """
    
    days_until_deadline = serializers.IntegerField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    brochure_url = serializers.SerializerMethodField()
    disclaimer = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'organization_name',
            'location',
            'category',
            'required_documents',
            'application_type',
            'external_url',
            'application_email',
            'email_subject_line',
            'brochure_url',
            'prep_checklist',
            'is_verified',
            'is_active',
            'is_featured',
            'deadline',
            'days_until_deadline',
            'is_expired',
            'created_at',
            'updated_at',
            'disclaimer',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_brochure_url(self, obj):
        """Return the brochure URL if available."""
        if obj.brochure_upload:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.brochure_upload.url)
            return obj.brochure_upload.url
        return None
    
    def get_disclaimer(self, obj):
        """Return the platform disclaimer."""
        return settings.PLATFORM_DISCLAIMER


class JobListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for job listings.
    
    Used for list views to reduce payload size.
    """
    
    days_until_deadline = serializers.IntegerField(read_only=True)
    brochure_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'organization_name',
            'location',
            'category',
            'required_documents',
            'application_type',
            'external_url',
            'application_email',
            'email_subject_line',
            'brochure_url',
            'prep_checklist',
            'is_verified',
            'deadline',
            'days_until_deadline',
        ]
    
    def get_brochure_url(self, obj):
        """Return the brochure URL if available."""
        if obj.brochure_upload:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.brochure_upload.url)
            return obj.brochure_upload.url
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
