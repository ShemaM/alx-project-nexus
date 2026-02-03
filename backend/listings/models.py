"""
Listings Models for BYN-K Platform.

The Listing Engine - curates opportunities from WhatsApp/PDFs
and redirects users to external NGO portals.
"""

from django.db import models
from django.conf import settings
from django.utils import timezone


class Job(models.Model):
    """
    Job model representing an opportunity listing.
    
    This is a Gateway Platform - we curate opportunities and redirect
    users to external portals (Forms, Emails, Websites).
    """
    
    # Required Document Choices (for Advanced Filters)
    DOCUMENT_CHOICES = [
        ('alien_card', 'Alien Card'),
        ('ctd', 'CTD (Convention Travel Document)'),
        ('passport', 'Passport'),
        ('waiting_slip', 'Waiting Slip'),
        ('national_id', 'National ID'),
        ('work_permit', 'Work Permit'),
        ('birth_certificate', 'Birth Certificate'),
        ('any_id', 'Any Valid ID'),
        ('not_specified', 'Not Specified'),
    ]
    
    # Application Type Choices
    APPLICATION_TYPE_CHOICES = [
        ('link', 'External Link'),
        ('email', 'Email Application'),
        ('pdf', 'PDF Brochure'),
    ]
    
    # Category Choices
    CATEGORY_CHOICES = [
        ('job', 'Job'),
        ('scholarship', 'Scholarship'),
        ('internship', 'Internship'),
        ('fellowship', 'Fellowship'),
        ('training', 'Training'),
    ]
    
    # Location Choices
    LOCATION_CHOICES = [
        ('kenya', 'Kenya'),
        ('uganda', 'Uganda'),
        ('tanzania', 'Tanzania'),
        ('rwanda', 'Rwanda'),
        ('remote', 'Remote'),
        ('multiple', 'Multiple Locations'),
    ]
    
    # Basic Information
    title = models.CharField(
        max_length=255,
        help_text="The opportunity title - be clear and descriptive"
    )
    organization_name = models.CharField(
        max_length=255,
        help_text="The organization offering this opportunity"
    )
    location = models.CharField(
        max_length=50,
        choices=LOCATION_CHOICES,
        blank=True,
        help_text="Where is this opportunity located?"
    )
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='job',
        help_text="The type of opportunity"
    )
    
    # Required Documents (for Advanced Filtering)
    required_documents = models.JSONField(
        default=list,
        blank=True,
        help_text="Which IDs are accepted for this opportunity? (Powers the Advanced Filters)"
    )
    
    # Application Type & URLs
    application_type = models.CharField(
        max_length=20,
        choices=APPLICATION_TYPE_CHOICES,
        default='link',
        help_text="How should applicants apply?"
    )
    external_url = models.URLField(
        blank=True,
        null=True,
        help_text="URL to MS Forms/Website (for 'External Link' type)"
    )
    application_email = models.EmailField(
        blank=True,
        null=True,
        help_text="Email address for applications (for 'Email' type)"
    )
    email_subject_line = models.CharField(
        max_length=255,
        blank=True,
        help_text="Suggested subject line for email applications"
    )
    brochure_upload = models.FileField(
        upload_to='brochures/',
        blank=True,
        null=True,
        help_text="PDF brochure for ads (e.g., Akili Dada Office Manager)"
    )
    
    # Preparation Checklist (for user guidance)
    prep_checklist = models.JSONField(
        default=list,
        blank=True,
        help_text="List items like 'Resume', 'Cover Letter', 'Recommendation Letters'"
    )
    
    # Verification & Status
    is_verified = models.BooleanField(
        default=False,
        help_text="Shows 'WhatsApp Group Verified' badge"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this opportunity is currently visible"
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Show in featured section"
    )
    
    # Deadline
    deadline = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Application deadline"
    )
    
    # Admin "WhatsApp-to-Web" Efficiency (Phase 4)
    raw_data = models.TextField(
        blank=True,
        help_text="Raw text pasted from WhatsApp (for admin convenience)"
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_jobs'
    )
    
    class Meta:
        verbose_name = 'Job Listing'
        verbose_name_plural = 'Job Listings'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.organization_name}"
    
    @property
    def days_until_deadline(self):
        """Calculate days remaining until deadline."""
        if not self.deadline:
            return None
        delta = self.deadline - timezone.now()
        return max(0, delta.days)
    
    @property
    def is_expired(self):
        """Check if the opportunity has passed its deadline."""
        if not self.deadline:
            return False
        return timezone.now() > self.deadline


class ClickAnalytics(models.Model):
    """
    Analytics model for tracking user clicks/redirects.
    
    Phase 4: Admin "WhatsApp-to-Web" Efficiency
    Tracks which opportunities are most popular.
    """
    
    CLICK_TYPE_CHOICES = [
        ('apply', 'Apply Button'),
        ('view_brochure', 'View Brochure'),
        ('compose_email', 'Compose Email'),
        ('view_details', 'View Details'),
    ]
    
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='click_analytics'
    )
    click_type = models.CharField(
        max_length=50,
        choices=CLICK_TYPE_CHOICES,
        default='apply'
    )
    click_count = models.PositiveIntegerField(default=0)
    last_clicked_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Click Analytics'
        verbose_name_plural = 'Click Analytics'
        unique_together = ['job', 'click_type']
    
    def __str__(self):
        return f"{self.job.title} - {self.click_type}: {self.click_count}"
    
    @classmethod
    def track_click(cls, job_id, click_type):
        """Increment click counter for a job."""
        analytics, _ = cls.objects.get_or_create(
            job_id=job_id,
            click_type=click_type,
            defaults={'click_count': 0}
        )
        analytics.click_count += 1
        analytics.save()
        return analytics
