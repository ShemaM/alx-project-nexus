"""
Listings Filters.

Phase 3: Advanced Filtering
Implements django-filter to allow frontend queries like:
?docs=alien_card&category=scholarship&work_mode=remote&closing_soon=true

Phase 4: Multi-select Filtering
Enhanced to support:
- Multiple categories: ?categories=job,scholarship,internship
- Multiple work modes: ?work_modes=remote,hybrid
- icontains for titles and descriptions
- in lookups for categories and work types
"""

import django_filters
from django.db import models
from django.utils import timezone
from datetime import timedelta
from .models import Job


class JobFilter(django_filters.FilterSet):
    """
    Filter for Job listings.
    
    Supports filtering by:
    - docs: Required documents (e.g., ?docs=alien_card)
    - category: Single category (e.g., ?category=scholarship)
    - categories: Multiple categories comma-separated (e.g., ?categories=job,scholarship)
    - location: Location/Country (e.g., ?location=kenya)
    - city: City (e.g., ?city=Nairobi) - uses icontains
    - work_mode: Single work mode (e.g., ?work_mode=remote)
    - work_modes: Multiple work modes comma-separated (e.g., ?work_modes=remote,hybrid)
    - commitment: Full-time/part-time/etc (e.g., ?commitment=full_time)
    - target_group: Target audience (e.g., ?target_group=refugees)
    - education_level: Required education (e.g., ?education_level=undergraduate)
    - funding_type: Funding status (e.g., ?funding_type=fully)
    - is_paid: Paid opportunities (e.g., ?is_paid=true)
    - stipend_min/stipend_max: Stipend range (e.g., ?stipend_min=1000)
    - deadline_before/deadline_after: Deadline range (e.g., ?deadline_before=2026-03-01)
    - closing_soon: Opportunities closing within 7 days (e.g., ?closing_soon=true)
    - is_rolling: Rolling deadline opportunities (e.g., ?is_rolling=true)
    - is_verified: Verification status - exact match (e.g., ?is_verified=true)
    - search: Full-text search in title/org/description - uses icontains (e.g., ?search=office)
    """
    
    # Filter by required documents (JSONField)
    docs = django_filters.CharFilter(method='filter_by_document')
    
    # Category filter - single selection (backward compatible)
    category = django_filters.ChoiceFilter(choices=Job.CATEGORY_CHOICES)
    
    # Categories filter - multiple selection with in lookup
    categories = django_filters.CharFilter(method='filter_by_categories')
    
    # Location filters
    location = django_filters.ChoiceFilter(choices=Job.LOCATION_CHOICES)
    city = django_filters.CharFilter(lookup_expr='icontains')
    
    # Work mode filter - single selection (backward compatible)
    work_mode = django_filters.ChoiceFilter(choices=Job.WORK_MODE_CHOICES)
    
    # Work modes filter - multiple selection with in lookup
    work_modes = django_filters.CharFilter(method='filter_by_work_modes')
    
    # Commitment filter
    commitment = django_filters.ChoiceFilter(choices=Job.COMMITMENT_CHOICES)
    
    # Eligibility filters
    target_group = django_filters.ChoiceFilter(choices=Job.TARGET_GROUP_CHOICES)
    education_level = django_filters.ChoiceFilter(choices=Job.EDUCATION_LEVEL_CHOICES)
    
    # Funding filters
    funding_type = django_filters.ChoiceFilter(choices=Job.FUNDING_TYPE_CHOICES)
    is_paid = django_filters.BooleanFilter()
    stipend_min = django_filters.NumberFilter(field_name='stipend_min', lookup_expr='gte')
    stipend_max = django_filters.NumberFilter(field_name='stipend_max', lookup_expr='lte')
    
    # Deadline intelligence filters
    deadline_before = django_filters.DateFilter(field_name='deadline', lookup_expr='lte')
    deadline_after = django_filters.DateFilter(field_name='deadline', lookup_expr='gte')
    closing_soon = django_filters.BooleanFilter(method='filter_closing_soon')
    is_rolling = django_filters.BooleanFilter()
    
    # Status filters - exact matching for boolean fields
    is_verified = django_filters.BooleanFilter()
    is_active = django_filters.BooleanFilter()
    is_featured = django_filters.BooleanFilter()
    
    # Application type filter
    application_type = django_filters.ChoiceFilter(
        choices=Job.APPLICATION_TYPE_CHOICES
    )
    
    # Search filter - uses icontains for titles and descriptions
    search = django_filters.CharFilter(method='filter_by_search')
    
    # Legacy filter (keeping for backward compatibility)
    upcoming = django_filters.BooleanFilter(method='filter_upcoming')
    
    class Meta:
        model = Job
        fields = [
            # Document filters
            'docs', 
            # Category (single and multiple)
            'category',
            'categories',
            # Location
            'location', 
            'city',
            # Work mode (single and multiple)
            'work_mode',
            'work_modes',
            # Commitment
            'commitment',
            # Eligibility
            'target_group',
            'education_level',
            # Funding
            'funding_type',
            'is_paid',
            'stipend_min',
            'stipend_max',
            # Deadline intelligence
            'deadline_before',
            'deadline_after',
            'closing_soon',
            'is_rolling',
            # Status
            'is_verified', 
            'is_active',
            'is_featured',
            'application_type',
            # Search
            'search',
            # Legacy
            'upcoming',
        ]
    
    def filter_by_document(self, queryset, name, value):
        """
        Filter jobs by required document type.
        
        Checks if the document is in the required_documents JSONField array.
        Uses a JSON-compatible approach that works with SQLite and PostgreSQL.
        """
        if not value:
            return queryset
        
        # Use icontains for SQLite compatibility
        # This will search for the value string within the JSON array
        # For production with PostgreSQL, you could use __contains lookup
        return queryset.filter(required_documents__icontains=value)
    
    def filter_by_categories(self, queryset, name, value):
        """
        Filter jobs by multiple categories (comma-separated).
        
        Uses __in lookup to support multiple category selections.
        Example: ?categories=job,scholarship,internship
        """
        if not value:
            return queryset
        
        # Split comma-separated categories and filter
        categories = [cat.strip() for cat in value.split(',') if cat.strip()]
        if categories:
            return queryset.filter(category__in=categories)
        return queryset
    
    def filter_by_work_modes(self, queryset, name, value):
        """
        Filter jobs by multiple work modes (comma-separated).
        
        Uses __in lookup to support multiple work mode selections.
        Example: ?work_modes=remote,hybrid
        """
        if not value:
            return queryset
        
        # Split comma-separated work modes and filter
        work_modes = [wm.strip() for wm in value.split(',') if wm.strip()]
        if work_modes:
            return queryset.filter(work_mode__in=work_modes)
        return queryset
    
    def filter_by_search(self, queryset, name, value):
        """
        Full-text search in title, organization name, city and description.
        
        Uses icontains for case-insensitive partial matching.
        """
        if not value:
            return queryset
        
        return queryset.filter(
            models.Q(title__icontains=value) |
            models.Q(organization_name__icontains=value) |
            models.Q(city__icontains=value) |
            models.Q(description__icontains=value)
        )
    
    def filter_upcoming(self, queryset, name, value):
        """
        Filter to show only jobs with upcoming deadlines.
        """
        if not value:
            return queryset
        
        return queryset.filter(deadline__gte=timezone.now())
    
    def filter_closing_soon(self, queryset, name, value):
        """
        Filter to show jobs closing within 7 days.
        """
        if not value:
            return queryset
        
        now = timezone.now()
        seven_days_later = now + timedelta(days=7)
        return queryset.filter(
            deadline__gte=now,
            deadline__lte=seven_days_later
        )
