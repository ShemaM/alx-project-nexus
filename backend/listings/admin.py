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
from .models import Job, ClickAnalytics, Partner, Event
from .tasks import send_immediate_opportunity_notification
from .widgets import DocumentCheckboxWidget, PrepChecklistWidget

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


# ============================================
# Custom Forms
# ============================================

class JobAdminForm(forms.ModelForm):
    """
    Non-technical-friendly admin form for Job listings.

    - required_documents → checkboxes (no JSON knowledge needed)
    - prep_checklist → row-by-row text inputs (no JSON knowledge needed)
    - All field labels are plain English with helpful descriptions
    """

    class Meta:
        model = Job
        fields = [
            'title', 'slug', 'organization_name', 'org_logo',
            'category', 'location', 'city',
            'deadline', 'is_rolling', 'is_verified', 'is_active', 'is_featured',
            'work_mode', 'commitment', 'target_group', 'education_level',
            'funding_type', 'is_paid', 'stipend_min', 'stipend_max',
            'application_type', 'external_url', 'application_email',
            'email_subject_line', 'brochure_upload',
            'required_documents', 'prep_checklist',
            'description',
            'created_by', 'raw_data',
        ]
        widgets = {
            'required_documents': DocumentCheckboxWidget(),
            'prep_checklist': PrepChecklistWidget(),
            'raw_data': forms.Textarea(attrs={
                'rows': 10,
                'placeholder': 'Paste the raw WhatsApp message or job advert text here...'
            }),
            'description': forms.Textarea(attrs={
                'rows': 6,
                'placeholder': (
                    'Describe the opportunity in 2–4 sentences. '
                    'What will the person do? Who is it for? What skills are needed?'
                ),
            }),
            'email_subject_line': forms.TextInput(attrs={
                'placeholder': 'e.g. Application – Field Officer Position – [Your Name]'
            }),
            'external_url': forms.URLInput(attrs={
                'placeholder': 'https://forms.office.com/... or https://org.org/apply'
            }),
            'application_email': forms.EmailInput(attrs={
                'placeholder': 'hr@organization.org'
            }),
            'city': forms.TextInput(attrs={
                'placeholder': 'e.g. Nairobi, Nakuru, Kakuma'
            }),
        }

        labels = {
            'title': 'Opportunity Title',
            'slug': 'URL Slug (auto-filled)',
            'organization_name': 'Organization Name',
            'org_logo': 'Organization Logo',
            'category': 'Type of Opportunity',
            'location': 'Country',
            'city': 'City / Town',
            'deadline': 'Application Deadline',
            'is_rolling': 'Rolling Deadline (no fixed date)',
            'is_verified': 'Verified (WhatsApp Group Confirmed)',
            'is_active': 'Visible on Website',
            'is_featured': 'Featured on Homepage',
            'work_mode': 'Work Arrangement',
            'commitment': 'Time Commitment',
            'target_group': 'Who is this for?',
            'education_level': 'Education Required',
            'funding_type': 'Funding Status',
            'is_paid': 'Is this a paid opportunity?',
            'stipend_min': 'Minimum Stipend (KES)',
            'stipend_max': 'Maximum Stipend (KES)',
            'application_type': 'How do people apply?',
            'external_url': 'Application Link (URL)',
            'application_email': 'Application Email Address',
            'email_subject_line': 'Suggested Email Subject Line',
            'brochure_upload': 'PDF Brochure / Flyer',
            'required_documents': 'Accepted Documents (IDs)',
            'prep_checklist': 'Application Checklist',
            'description': 'Opportunity Description',
            'created_by': 'Created By',
            'raw_data': 'Original WhatsApp / Source Text',
        }

        help_texts = {
            'title': 'Clear, specific title. Example: "Field Officer – UNHCR Kenya" not just "Job".',
            'organization_name': 'Full name of the NGO, company, school, or foundation.',
            'org_logo': 'Upload a square or circular logo (PNG/JPG preferred).',
            'category': 'Pick the closest match. This drives the homepage category counts.',
            'is_rolling': 'Tick this if the opportunity has no fixed deadline — applications are accepted anytime.',
            'is_verified': 'Tick once you have personally confirmed this listing from the WhatsApp group or official source.',
            'is_active': 'Untick to hide this opportunity without deleting it (useful after deadline passes).',
            'is_featured': 'Featured opportunities appear prominently on the homepage.',
            'work_mode': 'Remote = fully online. Hybrid = mix. On-site = physical location required.',
            'target_group': 'Who is primarily eligible? "All" means anyone can apply.',
            'is_paid': 'Tick if there is a salary, stipend, or any financial compensation.',
            'stipend_min': 'Leave blank if amount is not mentioned.',
            'stipend_max': 'Leave blank if amount is not mentioned.',
            'application_type': (
                '"External Link" = redirect to a website/form. '
                '"Email Application" = user sends an email. '
                '"PDF Brochure" = upload a flyer.'
            ),
            'email_subject_line': 'Suggest what subject line applicants should use when emailing.',
            'brochure_upload': 'Upload the PDF flyer if the application type is "PDF Brochure".',
            'description': 'This text appears on the opportunity detail page. Keep it informative but concise.',
        }


# ============================================
# Job Admin
# ============================================

@admin.register(Job)
class JobAdmin(ModelAdmin):
    """
    Admin configuration for Job listings using Django Unfold.
    """

    form = JobAdminForm

    # Automatically fills the slug input as you type the title
    prepopulated_fields = {"slug": ("title",)}

    list_display = [
        'org_logo_thumbnail',
        'title',
        'organization_name',
        'category',
        'is_verified',
        'is_active',
        'is_featured',
        'deadline',
        'total_clicks_display',
        'created_at',
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

    fieldsets = (
        # ── Tab 1: Core details ──────────────────────────────────────────
        ('📋 Opportunity Details', {
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
            'description': (
                'Start here. Fill in the basics — title, organization, location, and deadline. '
                'Tick "Verified" once you have confirmed the listing from the WhatsApp group.'
            ),
        }),

        # ── Tab 2: Description ───────────────────────────────────────────
        ('📝 Description', {
            'fields': (
                'description',
            ),
            'classes': ['tab'],
            'description': (
                'Write 2–4 sentences describing the opportunity. '
                'What will the person do? Who is it for? What skills are needed?'
            ),
        }),

        # ── Tab 3: Who can apply? ────────────────────────────────────────
        ('🎯 Eligibility & Work Mode', {
            'fields': (
                'work_mode',
                'commitment',
                'target_group',
                'education_level',
            ),
            'classes': ['tab'],
            'description': 'Who is this opportunity for, and how is the work structured?',
        }),

        # ── Tab 4: Money ─────────────────────────────────────────────────
        ('💰 Funding & Compensation', {
            'fields': (
                'funding_type',
                'is_paid',
                'stipend_min',
                'stipend_max',
            ),
            'classes': ['tab'],
            'description': (
                'Is there a salary or stipend? '
                'Even entering "Fully Funded" or "Not Paid" helps people filter quickly.'
            ),
        }),

        # ── Tab 5: How to apply + documents ─────────────────────────────
        ('📨 Application & Documents', {
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
            'description': (
                'Tell people how to apply and which documents are accepted. '
                'The document checkboxes power the "Filter by your document" feature on the homepage — '
                'please tick all that apply.'
            ),
        }),

        # ── Tab 6: Analytics & metadata ──────────────────────────────────
        ('📊 Analytics & Metadata', {
            'fields': (
                'total_clicks_display',
                'created_by',
                'created_at',
                'updated_at',
            ),
            'classes': ['tab'],
            'description': 'Read-only tracking data. No action needed here.',
        }),

        # ── Tab 7: WhatsApp source (collapsible) ─────────────────────────
        ('💬 Original Source Text', {
            'fields': ('raw_data',),
            'classes': ['tab', 'collapse'],
            'description': (
                'Paste the original WhatsApp message or job advert here for reference. '
                'This is not shown to users — it is just for your records.'
            ),
        }),
    )

    # ── Custom display methods ────────────────────────────────────────────

    def org_logo_thumbnail(self, obj):
        if obj.org_logo:
            return mark_safe(
                f'<img src="{obj.org_logo.url}" width="44" height="44" '
                f'style="object-fit:contain;border-radius:6px;border:1px solid #e2e8f0;" />'
            )
        return "—"
    org_logo_thumbnail.short_description = 'Logo'

    def total_clicks_display(self, obj):
        if obj.pk:
            total = sum(a.click_count for a in obj.click_analytics.all())
            return total if total else "—"
        return "—"
    total_clicks_display.short_description = 'Clicks'

    def save_model(self, request, obj, form, change):
        """Auto-generate slug if missing. Set creator on new listings."""
        if not obj.slug:
            obj.slug = slugify(obj.title)

        if not change:
            obj.created_by = request.user

        is_new = not change
        super().save_model(request, obj, form, change)

        # Notify subscribers immediately for newly created active opportunities.
        if is_new and obj.is_active:
            try:
                send_immediate_opportunity_notification.delay(obj.id)
            except Exception:
                send_immediate_opportunity_notification(obj.id)


# ============================================
# Click Analytics Admin
# ============================================

@admin.register(ClickAnalytics)
class ClickAnalyticsAdmin(ModelAdmin):
    list_display = ['job', 'click_type', 'click_count', 'last_clicked_at']
    readonly_fields = ['click_count', 'last_clicked_at']
    ordering = ['-click_count']


# ============================================
# Partner Admin
# ============================================

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
            return mark_safe(
                f'<img src="{obj.logo.url}" width="36" height="36" '
                f'style="object-fit:contain;border-radius:8px;border:1px solid #e2e8f0;" />'
            )
        return "—"
    logo_thumbnail.short_description = 'Logo'

    def logo_preview(self, obj):
        if obj.logo:
            return mark_safe(
                f'<img src="{obj.logo.url}" width="120" height="120" '
                f'style="object-fit:contain;border-radius:10px;border:1px solid #e2e8f0;'
                f'padding:8px;background:#fff;" />'
            )
        return "No logo uploaded yet."
    logo_preview.short_description = 'Logo Preview'


# ============================================
# Event Admin
# ============================================

@admin.register(Event)
class EventAdmin(ModelAdmin):
    list_display = ['title', 'partner', 'category', 'start_time', 'is_virtual', 'is_active']
    list_filter = ['category', 'is_virtual', 'is_active']
    ordering = ['-start_time']
    search_fields = ['title', 'partner', 'location']
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('📅 Event Details', {
            'fields': (
                'title',
                'slug',
                'partner',
                'category',
                'description',
            ),
            'classes': ['tab'],
            'description': 'Basic event info. The slug auto-fills as you type the title.',
        }),
        ('🕐 Timing & Access', {
            'fields': (
                'start_time',
                'end_time',
                'is_virtual',
                'stream_url',
                'is_active',
            ),
            'classes': ['tab'],
            'description': 'Control when the event runs and where to join it.',
        }),
        ('📍 Venue & Logistics', {
            'fields': (
                'location',
                'directions',
                'requirements',
            ),
            'classes': ['tab'],
            'description': 'Physical venue details, or leave blank for fully virtual events.',
        }),
        ('🔧 Metadata', {
            'fields': (
                'created_at',
                'updated_at',
            ),
            'classes': ['tab'],
            'description': 'Auto-recorded timestamps. Read-only.',
        }),
    )


# ============================================
# Hide noisy technical models from the admin nav
# ============================================
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
