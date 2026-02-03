"""
Listings Admin Configuration.

Phase 4: Admin "WhatsApp-to-Web" Efficiency
Custom admin forms for quick content entry from WhatsApp messages.
"""

from django.contrib import admin
from django import forms
from .models import Job, ClickAnalytics


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
class JobAdmin(admin.ModelAdmin):
    """Admin configuration for Job listings."""
    
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
    
    list_filter = [
        'is_verified',
        'is_active',
        'is_featured',
        'category',
        'application_type',
        'location',
    ]
    
    search_fields = ['title', 'organization_name', 'raw_data']
    
    date_hierarchy = 'created_at'
    
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'updated_at', 'total_clicks']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'organization_name', 'category', 'location')
        }),
        ('Application Details', {
            'fields': (
                'application_type', 
                'external_url', 
                'application_email',
                'email_subject_line',
                'brochure_upload'
            )
        }),
        ('Requirements & Preparation', {
            'fields': ('required_documents', 'prep_checklist'),
            'description': 'Enter JSON arrays for documents and checklist items.'
        }),
        ('WhatsApp Raw Data (Quick Entry)', {
            'fields': ('raw_data',),
            'classes': ('collapse',),
            'description': 'Paste the original WhatsApp message for reference.'
        }),
        ('Status & Visibility', {
            'fields': ('is_verified', 'is_active', 'is_featured', 'deadline')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def total_clicks(self, obj):
        """Display total clicks for this job."""
        total = sum(a.click_count for a in obj.click_analytics.all())
        return total
    total_clicks.short_description = 'Total Clicks'
    
    def save_model(self, request, obj, form, change):
        """Auto-set created_by to current admin user."""
        if not change:  # Only on creation
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(ClickAnalytics)
class ClickAnalyticsAdmin(admin.ModelAdmin):
    """Admin configuration for Click Analytics."""
    
    list_display = ['job', 'click_type', 'click_count', 'last_clicked_at']
    list_filter = ['click_type', 'last_clicked_at']
    search_fields = ['job__title', 'job__organization_name']
    ordering = ['-click_count']
    readonly_fields = ['click_count', 'last_clicked_at']
