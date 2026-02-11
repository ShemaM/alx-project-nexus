"""
Listings Admin Configuration.

Phase 4: Admin "WhatsApp-to-Web" Efficiency
Custom admin forms for quick content entry from WhatsApp messages.
Uses Django Unfold for modern, Tailwind-based SaaS look.
"""

from django.utils.html import mark_safe # Import mark_safe for rendering HTML
from django.contrib import admin
from django.conf import settings
from django import forms
<<<<<<< HEAD
from django.utils.text import slugify
=======
from django.utils.html import mark_safe
>>>>>>> e9e2226a8e8cc65ff9b2fd85636946ef2c9a6d62
from unfold.admin import ModelAdmin
from .models import Job, ClickAnalytics, Subscription, Partner

# ============================================
# Admin Site Customization
# ============================================
admin.site.site_header = getattr(settings, 'ADMIN_SITE_HEADER', 'BYN-K Platform Administration')
admin.site.site_title = getattr(settings, 'ADMIN_SITE_TITLE', 'BYN-K Admin')
admin.site.index_title = getattr(settings, 'ADMIN_INDEX_TITLE', 'Platform Management')


class JobAdminForm(forms.ModelForm):
    """
    Custom admin form for Job with "Raw Data" text area.
    """

    class Meta:
        model = Job
        # We include slug here so the form recognizes it
        fields = [
            'title', 'slug', 'organization_name', 'org_logo', 'category', 'location', 'city',
            'deadline', 'is_rolling', 'is_verified', 'is_active', 'is_featured',
            'work_mode', 'commitment', 'target_group', 'education_level',
            'funding_type', 'is_paid', 'stipend_min', 'stipend_max',
            'application_type', 'external_url', 'application_email',
            'email_subject_line', 'brochure_upload', 'required_documents',
            'prep_checklist', 'created_by', 'raw_data',
        ]
        widgets = {
            'raw_data': forms.Textarea(attrs={
                'rows': 10,
                'placeholder': 'Paste the raw WhatsApp message here...'
            }),
            'prep_checklist': forms.Textarea(attrs={
                'rows': 5,
                'placeholder': '[{"item": "Resume", "required": true}]'
            }),
            'required_documents': forms.Textarea(attrs={
                'rows': 3,
                'placeholder': '["passport", "id"]'
            }),
        }


@admin.register(Job)
class JobAdmin(ModelAdmin):
    """
    Admin configuration for Job listings using Django Unfold.
    """
    
    form = JobAdminForm
    
    # This automatically fills the slug input as you type the title
    prepopulated_fields = {"slug": ("title",)}
    
    list_display = [
<<<<<<< HEAD
        'org_logo_thumbnail', # Display logo thumbnail
=======
        'logo_thumbnail',
>>>>>>> e9e2226a8e8cc65ff9b2fd85636946ef2c9a6d62
        'title', 
        'organization_name', 
        'category',
        'is_verified', 
        'is_active',
        'deadline',
        'total_clicks_display',
        'created_at'
    ]
    
<<<<<<< HEAD
    search_fields = ['title', 'organization_name', 'city']
    
=======
    # Search capabilities for Title and Organization
    search_fields = ['title', 'organization_name', 'city']
    
    # Filters for all filterable fields
>>>>>>> e9e2226a8e8cc65ff9b2fd85636946ef2c9a6d62
    list_filter = [
        'category',
        'work_mode',
        'commitment',
<<<<<<< HEAD
        'is_verified',
        'is_active',
=======
        'target_group',
        'education_level',
        'funding_type',
        'is_paid',
        'is_rolling',
        'application_type',
        'location',
        'is_verified',  # WhatsApp verified status
        'is_active',
        'is_featured',
>>>>>>> e9e2226a8e8cc65ff9b2fd85636946ef2c9a6d62
    ]
    
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'updated_at', 'total_clicks_display']
    
    # UPDATED FIELDSETS: Added 'slug' to 'Opportunity Details'
    fieldsets = (
        ('Opportunity Details', {
            'fields': (
                'title', 
<<<<<<< HEAD
                'slug',  # CRITICAL: If this is missing from fieldsets, Unfold won't save it
                'organization_name', 
                'org_logo', # Add org_logo to fieldset
=======
                'organization_name',
                'org_logo',
>>>>>>> e9e2226a8e8cc65ff9b2fd85636946ef2c9a6d62
                'category', 
                'location',
                'city',
                'deadline',
                'is_rolling',
                'is_verified',
                'is_active',
                'is_featured',
            ),
            'classes': ['tab'],
        }),
        ('Work Mode & Eligibility', {
            'fields': (
                'work_mode',
                'commitment',
                'target_group',
                'education_level',
            ),
            'classes': ['tab'],
        }),
        ('Funding & Compensation', {
            'fields': (
                'funding_type',
                'is_paid',
                'stipend_min',
                'stipend_max',
            ),
            'classes': ['tab'],
        }),
        ('Work Mode & Eligibility', {
            'fields': (
                'work_mode',
                'commitment',
                'target_group',
                'education_level',
            ),
            'classes': ['tab'],
            'description': 'Work arrangement and eligibility requirements.'
        }),
        ('Funding & Compensation', {
            'fields': (
                'funding_type',
                'is_paid',
                'stipend_min',
                'stipend_max',
            ),
            'classes': ['tab'],
            'description': 'Financial details of the opportunity.'
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
        }),
        ('Analytics & Metadata', {
            'fields': (
                'total_clicks_display',
                'created_by', 
                'created_at', 
                'updated_at',
            ),
            'classes': ['tab'],
        }),
        ('WhatsApp Raw Data', {
            'fields': ('raw_data',),
            'classes': ['tab', 'collapse'],
        }),
    )

    def org_logo_thumbnail(self, obj):
        if obj.org_logo:
            return mark_safe(f'<img src="{obj.org_logo.url}" width="50" height="50" style="object-fit: contain;" />')
        return "No Image"
    org_logo_thumbnail.short_description = 'Logo'
    
<<<<<<< HEAD
    def total_clicks_display(self, obj):
        if obj.pk:
            return sum(a.click_count for a in obj.click_analytics.all())
        return 0
    total_clicks_display.short_description = 'Total Clicks'
=======
    def logo_thumbnail(self, obj):
        """Display a small thumbnail of the organization logo."""
        if obj.org_logo:
            return mark_safe(f'<img src="{obj.org_logo.url}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px;" />')
        return '-'
    logo_thumbnail.short_description = 'Logo'
    
    def total_clicks(self, obj):
        """Display total clicks for this job (read-only)."""
        total = sum(a.click_count for a in obj.click_analytics.all())
        return total
    total_clicks.short_description = 'Total Clicks'
>>>>>>> e9e2226a8e8cc65ff9b2fd85636946ef2c9a6d62
    
    def save_model(self, request, obj, form, change):
        """
        Final safety check: If slug is somehow still empty, generate it.
        Also sets the creator.
        """
        if not obj.slug:
            obj.slug = slugify(obj.title)
            
        if not change:
            obj.created_by = request.user
            
        super().save_model(request, obj, form, change)


@admin.register(ClickAnalytics)
class ClickAnalyticsAdmin(ModelAdmin):
    list_display = ['job', 'click_type', 'click_count', 'last_clicked_at']
    readonly_fields = ['click_count', 'last_clicked_at']


@admin.register(Subscription)
class SubscriptionAdmin(ModelAdmin):
<<<<<<< HEAD
    list_display = ['email', 'is_active', 'created_at']
=======
    """
    Admin configuration for Email Subscriptions using Django Unfold.
    
    Allows admins to:
    - View all subscribers
    - Filter by active/inactive status
    - Manually deactivate subscriptions
    - See subscription history
    """
    
    list_display = [
        'email', 
        'is_active', 
        'created_at', 
        'confirmed_at',
        'last_notified_at',
    ]
>>>>>>> e9e2226a8e8cc65ff9b2fd85636946ef2c9a6d62


@admin.register(Partner)
class PartnerAdmin(ModelAdmin):
<<<<<<< HEAD
    list_display = ['name', 'website_url', 'is_featured']
    readonly_fields = ['created_at']
=======
    """Admin configuration for Partner organizations."""

    list_display = ['name', 'website_url', 'is_featured', 'created_at']
    search_fields = ['name']
    list_filter = ['is_featured']
    ordering = ['name']
>>>>>>> e9e2226a8e8cc65ff9b2fd85636946ef2c9a6d62
