"""
Listings Models for BYN-K Platform.

The Listing Engine - curates opportunities from WhatsApp/PDFs
and redirects users to external NGO portals.
"""

import uuid
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
    
    # Location Choices (Country level)
    LOCATION_CHOICES = [
        ('kenya', 'Kenya'),
        ('uganda', 'Uganda'),
        ('tanzania', 'Tanzania'),
        ('rwanda', 'Rwanda'),
        ('remote', 'Remote'),
        ('multiple', 'Multiple Locations'),
    ]
    
    # Work Mode Choices
    WORK_MODE_CHOICES = [
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
        ('onsite', 'On-site'),
    ]
    
    # Commitment Choices
    COMMITMENT_CHOICES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('short_term', 'Short-term'),
        ('long_term', 'Long-term'),
    ]
    
    # Target Group Choices
    TARGET_GROUP_CHOICES = [
        ('refugees', 'Refugees'),
        ('youth', 'Youth'),
        ('women', 'Women'),
        ('all', 'All'),
    ]
    
    # Education Level Choices
    EDUCATION_LEVEL_CHOICES = [
        ('high_school', 'High School'),
        ('undergraduate', 'Undergraduate'),
        ('graduate', 'Graduate'),
        ('any', 'Any Level'),
    ]
    
    # Funding Type Choices
    FUNDING_TYPE_CHOICES = [
        ('fully', 'Fully Funded'),
        ('partially', 'Partially Funded'),
        ('none', 'Not Funded'),
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
    description = models.TextField(
        blank=True,
        help_text="Detailed description of the opportunity"
    )
    
    # Work Mode & Commitment (Filter Parity)
    work_mode = models.CharField(
        max_length=20,
        choices=WORK_MODE_CHOICES,
        blank=True,
        help_text="Remote, hybrid, or on-site"
    )
    commitment = models.CharField(
        max_length=20,
        choices=COMMITMENT_CHOICES,
        blank=True,
        help_text="Full-time, part-time, short-term, or long-term"
    )
    
    # Eligibility (Filter Parity)
    target_group = models.CharField(
        max_length=20,
        choices=TARGET_GROUP_CHOICES,
        blank=True,
        help_text="Target audience for this opportunity"
    )
    education_level = models.CharField(
        max_length=20,
        choices=EDUCATION_LEVEL_CHOICES,
        blank=True,
        help_text="Required education level"
    )
    
    # Funding (Filter Parity)
    funding_type = models.CharField(
        max_length=20,
        choices=FUNDING_TYPE_CHOICES,
        blank=True,
        help_text="Funding status of this opportunity"
    )
    is_paid = models.BooleanField(
        default=False,
        help_text="Is this a paid opportunity?"
    )
    stipend_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Minimum stipend amount"
    )
    stipend_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Maximum stipend amount"
    )
    
    # Location (Extended)
    city = models.CharField(
        max_length=100,
        blank=True,
        help_text="City where the opportunity is located"
    )
    
    # Deadline Intelligence
    is_rolling = models.BooleanField(
        default=False,
        help_text="Is this a rolling deadline opportunity?"
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


class Subscription(models.Model):
    """
    Email subscription model for opportunity alerts.
    
    Users can subscribe to receive notifications about new opportunities.
    Implements double opt-in confirmation flow for compliance and deliverability.
    """
    
    email = models.EmailField(
        unique=True,
        db_index=True,
        help_text="Subscriber email address"
    )
    is_active = models.BooleanField(
        default=False,
        help_text="Whether the subscription is confirmed and active"
    )
    confirmation_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        help_text="Token for email confirmation"
    )
    last_notified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Last time this subscriber was notified of new opportunities"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the subscription was confirmed"
    )
    
    class Meta:
        verbose_name = 'Email Subscription'
        verbose_name_plural = 'Email Subscriptions'
        ordering = ['-created_at']
    
    def __str__(self):
        status = "Active" if self.is_active else "Pending"
        return f"{self.email} ({status})"
    
    def confirm(self):
        """Confirm the subscription."""
        self.is_active = True
        self.confirmed_at = timezone.now()
        self.save()
    
    def unsubscribe(self):
        """Deactivate the subscription."""
        self.is_active = False
        self.save()
    
    def regenerate_token(self):
        """Regenerate the confirmation token."""
        self.confirmation_token = uuid.uuid4()
        self.save()
