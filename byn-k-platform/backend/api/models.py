from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User
import uuid


class Partner(models.Model):
    """Partner organization model for tracking opportunity providers."""
    name = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to='partner_logos/', blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def opportunity_count(self):
        """Return count of active opportunities for this partner."""
        return self.opportunities.filter(is_active=True).count()


class Opportunity(models.Model):
    """Opportunity model with slug support for SEO-friendly URLs."""
    CATEGORY_CHOICES = [
        ('jobs', 'Job'),
        ('internships', 'Internship'),
        ('scholarships', 'Scholarship'),
        ('fellowships', 'Fellowship'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    organization = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='opportunities')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    deadline = models.DateField(null=True, blank=True)
    description = models.TextField()
    is_verified = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    location = models.CharField(max_length=100, blank=True)
    apply_link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Multilingual support fields
    title_en = models.CharField(max_length=200, blank=True, help_text="English title")
    title_sw = models.CharField(max_length=200, blank=True, help_text="Swahili title")
    title_fr = models.CharField(max_length=200, blank=True, help_text="French title")
    description_en = models.TextField(blank=True, help_text="English description")
    description_sw = models.TextField(blank=True, help_text="Swahili description")
    description_fr = models.TextField(blank=True, help_text="French description")

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Opportunities'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """Auto-generate unique slug from title if not provided."""
        if not self.slug:
            base_slug = slugify(self.title)
            unique_slug = base_slug
            counter = 1
            while Opportunity.objects.filter(slug=unique_slug).exclude(pk=self.pk).exists():
                unique_slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)


class Subscription(models.Model):
    """Email subscription model for newsletter and alerts."""
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    confirmation_token = models.UUIDField(default=uuid.uuid4, editable=False)
    unsubscribe_token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        """Normalize email to lowercase before saving."""
        self.email = self.email.lower().strip()
        super().save(*args, **kwargs)


class Category(models.Model):
    """Category model for organizing opportunities with descriptions and icons."""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")
    color = models.CharField(max_length=20, blank=True, help_text="Tailwind color class")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    # Multilingual support
    name_en = models.CharField(max_length=50, blank=True)
    name_sw = models.CharField(max_length=50, blank=True)
    name_fr = models.CharField(max_length=50, blank=True)
    description_en = models.TextField(blank=True)
    description_sw = models.TextField(blank=True)
    description_fr = models.TextField(blank=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def opportunity_count(self):
        """Return count of active opportunities in this category."""
        # Derive mapping from Opportunity.CATEGORY_CHOICES to ensure consistency
        category_choices_map = {choice[1]: choice[0] for choice in Opportunity.CATEGORY_CHOICES}
        # Also add lowercase name mapping for flexibility
        category_key = category_choices_map.get(self.name) or self.name.lower()
        return Opportunity.objects.filter(category=category_key, is_active=True).count()
