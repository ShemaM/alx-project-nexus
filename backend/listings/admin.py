"""
Listings Admin Configuration.

Phase 4: Admin "WhatsApp-to-Web" Efficiency
Custom admin forms for quick content entry from WhatsApp messages.
Uses Django Unfold for modern, Tailwind-based SaaS look.
"""

from django.contrib import admin
from django.conf import settings
from django import forms
from unfold.admin import ModelAdmin
from .models import Job, ClickAnalytics

# ============================================
# Admin Site Customization
# ============================================
admin.site.site_header = getattr(settings, 'ADMIN_SITE_HEADER', 'BYN-K Platform Administration')
admin.site.site_title = getattr(settings, 'ADMIN_SITE_TITLE', 'BYN-K Admin')
admin.site.index_title = getattr(settings, 'ADMIN_INDEX_TITLE', 'Platform Management')


class JobAdminForm(forms.ModelForm):
    """
    Custom admin form for Job with "Raw Data" text area.
    
    Allows Manasseh to paste WhatsApp text, upload PDF, and click "Publish".
    """
    
    class Meta:
        model = Job
        fields = '__all__'
        widgets = {
            'raw_data': forms.Textarea(attrs={
                'rows': 10,
                'placeholder': 'Paste the raw WhatsApp message here...\n\n'
                               'Example:\n'
                               '📢 JOB ALERT!\n'
                               'Position: Office Manager\n'
                               'Organization: Akili Dada\n'
                               'Deadline: Feb 13, 2026\n'
                               'Apply: https://forms.office.com/...'
            }),
            'prep_checklist': forms.Textarea(attrs={
                'rows': 5,
                'placeholder': '[\n'
                               '  {"item": "Resume", "required": true},\n'
                               '  {"item": "Cover Letter", "required": true},\n'
                               '  {"item": "Recommendation Letters", "required": false}\n'
                               ']'
            }),
            'required_documents': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': '["alien_card", "ctd", "passport"]'
            }),
        }


@admin.register(Job)
class JobAdmin(ModelAdmin):
    """
    Admin configuration for Job listings using Django Unfold.
    
    Provides a modern, Tailwind-based admin interface with:
    - Search capabilities for Title and Organization
    - Filters for application_type, location, and is_verified (WhatsApp verified)
    - Fieldsets organized into collapsible sections
    """
    
    form = JobAdminForm
    
    list_display = [
        'title', 
        'organization_name', 
        'category',
        'application_type',
        'is_verified', 
        'is_active',
        'deadline',
        'total_clicks',
        'created_at'
    ]
    
    # Search capabilities for Title and Organization
    search_fields = ['title', 'organization_name']
    
    # Filters for application_type, location, and is_verified (WhatsApp verified)
    list_filter = [
        'application_type',
        'location',
        'is_verified',  # WhatsApp verified status
        'is_active',
        'is_featured',
        'category',
    ]
    
    date_hierarchy = 'created_at'
    
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'updated_at', 'total_clicks']
    
    # Fieldsets organized into collapsible sections
    fieldsets = (
        ('Opportunity Details', {
            'fields': (
                'title', 
                'organization_name', 
                'category', 
                'location',
                'deadline',
                'is_verified',
                'is_active',
                'is_featured',
            ),
            'classes': ['tab'],
            'description': 'Core opportunity information and status settings.'
        }),
        ('Gateway Logic', {
            'fields': (
                'application_type', 
                'external_url', 
                'application_email',
                'email_subject_line',
                'brochure_upload',
                'required_documents', 
                'prep_checklist',
            ),
            'classes': ['tab'],
            'description': 'Configure how users apply and what documents are required.'
        }),
        ('Analytics', {
            'fields': (
                'total_clicks',
                'created_by', 
                'created_at', 
                'updated_at',
            ),
            'classes': ['tab'],
            'description': 'View performance metrics and metadata.'
        }),
        ('WhatsApp Raw Data (Quick Entry)', {
            'fields': ('raw_data',),
            'classes': ['tab', 'collapse'],
            'description': 'Paste the original WhatsApp message for reference.'
        }),
    )
    
    def total_clicks(self, obj):
        """Display total clicks for this job (read-only)."""
        total = sum(a.click_count for a in obj.click_analytics.all())
        return total
    total_clicks.short_description = 'Total Clicks'
    
    def save_model(self, request, obj, form, change):
        """Auto-set created_by to current admin user."""
        if not change:  # Only on creation
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(ClickAnalytics)
class ClickAnalyticsAdmin(ModelAdmin):
    """Admin configuration for Click Analytics using Django Unfold."""
    
    list_display = ['job', 'click_type', 'click_count', 'last_clicked_at']
    list_filter = ['click_type', 'last_clicked_at']
    search_fields = ['job__title', 'job__organization_name']
    ordering = ['-click_count']
    readonly_fields = ['click_count', 'last_clicked_at']
