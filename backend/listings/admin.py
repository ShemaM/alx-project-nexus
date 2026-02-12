"""
Listings Admin Configuration.

Phase 4: Admin "WhatsApp-to-Web" Efficiency
Custom admin forms for quick content entry from WhatsApp messages.
Uses Django Unfold for modern, Tailwind-based SaaS look.
"""

from django.utils.html import mark_safe
from django.contrib import admin
from django.conf import settings
from django import forms
from django.utils.text import slugify
from unfold.admin import ModelAdmin
from .models import Job, ClickAnalytics, Partner
from .tasks import send_immediate_opportunity_notification

# ============================================
# Admin Site Customization
# ============================================
admin.site.site_header = getattr(settings, 'ADMIN_SITE_HEADER', 'BYN-K Platform Administration')
admin.site.site_title = getattr(settings, 'ADMIN_SITE_TITLE', 'BYN-K Admin')
admin.site.index_title = getattr(settings, 'ADMIN_INDEX_TITLE', 'Platform Management')
admin.site.index_template = "admin/index.html"


def _superuser_admin_access(request):
    user = getattr(request, "user", None)
    return bool(user and user.is_active and user.is_superuser)


admin.site.has_permission = _superuser_admin_access


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
        'org_logo_thumbnail',
        'title', 
        'organization_name', 
        'category',
        'is_verified', 
        'is_active',
        'deadline',
        'total_clicks_display',
        'created_at'
    ]
    
    search_fields = ['title', 'organization_name', 'city']
    
    list_filter = [
        'category',
        'work_mode',
        'commitment',
        'target_group',
        'education_level',
        'funding_type',
        'is_paid',
        'is_rolling',
        'application_type',
        'location',
        'is_verified',
        'is_active',
        'is_featured',
    ]
    
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'updated_at', 'total_clicks_display']
    
    # UPDATED FIELDSETS: Added 'slug' to 'Opportunity Details'
    fieldsets = (
        ('Opportunity Details', {
            'fields': (
                'title', 
                'slug',
                'organization_name',
                'org_logo',
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
    
    def total_clicks_display(self, obj):
        if obj.pk:
            return sum(a.click_count for a in obj.click_analytics.all())
        return 0
    total_clicks_display.short_description = 'Total Clicks'
    
    def save_model(self, request, obj, form, change):
        """
        Final safety check: If slug is somehow still empty, generate it.
        Also sets the creator.
        """
        if not obj.slug:
            obj.slug = slugify(obj.title)
            
        if not change:
            obj.created_by = request.user
            
        is_new = not change
        super().save_model(request, obj, form, change)

        # Notify update subscribers immediately for newly created active opportunities.
        if is_new and obj.is_active:
            try:
                send_immediate_opportunity_notification.delay(obj.id)
            except Exception:
                send_immediate_opportunity_notification(obj.id)


@admin.register(ClickAnalytics)
class ClickAnalyticsAdmin(ModelAdmin):
    list_display = ['job', 'click_type', 'click_count', 'last_clicked_at']
    readonly_fields = ['click_count', 'last_clicked_at']


@admin.register(Partner)
class PartnerAdmin(ModelAdmin):
    list_display = ['logo_thumbnail', 'name', 'website_url', 'is_featured', 'created_at']
    search_fields = ['name']
    list_filter = ['is_featured']
    ordering = ['name']
    readonly_fields = ['logo_preview', 'created_at']
    fields = ['name', 'logo', 'website_url', 'is_featured', 'logo_preview', 'created_at']

    def logo_thumbnail(self, obj):
        if obj.logo:
            return mark_safe(f'<img src="{obj.logo.url}" width="36" height="36" style="object-fit:contain;border-radius:8px;" />')
        return "-"
    logo_thumbnail.short_description = 'Logo'

    def logo_preview(self, obj):
        if obj.logo:
            return mark_safe(f'<img src="{obj.logo.url}" width="120" height="120" style="object-fit:contain;border-radius:10px;border:1px solid #e2e8f0;padding:8px;background:#fff;" />')
        return "No uploaded logo yet."
    logo_preview.short_description = 'Logo Preview'


# Hide noisy technical models from the main admin navigation.
try:
    from django.contrib.auth.models import Group
    admin.site.unregister(Group)
except Exception:
    pass

try:
    from django.contrib.sites.models import Site
    admin.site.unregister(Site)
except Exception:
    pass

try:
    from rest_framework.authtoken.models import TokenProxy
    admin.site.unregister(TokenProxy)
except Exception:
    pass

try:
    from django_celery_results.models import TaskResult, GroupResult
    admin.site.unregister(TaskResult)
    admin.site.unregister(GroupResult)
except Exception:
    pass

try:
    from allauth.socialaccount.models import SocialApp, SocialToken, SocialAccount
    admin.site.unregister(SocialApp)
    admin.site.unregister(SocialToken)
    admin.site.unregister(SocialAccount)
except Exception:
    pass

try:
    from allauth.account.models import EmailAddress
    admin.site.unregister(EmailAddress)
except Exception:
    pass
