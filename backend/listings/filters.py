"""
Listings Filters.

Phase 3: Advanced Filtering
Implements django-filter to allow frontend queries like:
?docs=alien_card&category=scholarship
"""

import django_filters
from .models import Job


class JobFilter(django_filters.FilterSet):
    """
    Filter for Job listings.
    
    Supports filtering by:
    - docs: Required documents (e.g., ?docs=alien_card)
    - category: Job category (e.g., ?category=scholarship)
    - location: Location (e.g., ?location=kenya)
    - is_verified: Verification status (e.g., ?is_verified=true)
    - search: Full-text search in title/org (e.g., ?search=office)
    """
    
    # Filter by required documents (JSONField)
    docs = django_filters.CharFilter(method='filter_by_document')
    
    # Filter by category
    category = django_filters.ChoiceFilter(choices=Job.CATEGORY_CHOICES)
    
    # Filter by location
    location = django_filters.ChoiceFilter(choices=Job.LOCATION_CHOICES)
    
    # Filter by verification status
    is_verified = django_filters.BooleanFilter()
    
    # Filter by active status
    is_active = django_filters.BooleanFilter()
    
    # Filter by featured status
    is_featured = django_filters.BooleanFilter()
    
    # Search filter
    search = django_filters.CharFilter(method='filter_by_search')
    
    # Filter by application type
    application_type = django_filters.ChoiceFilter(
        choices=Job.APPLICATION_TYPE_CHOICES
    )
    
    # Filter by deadline (upcoming only)
    upcoming = django_filters.BooleanFilter(method='filter_upcoming')
    
    class Meta:
        model = Job
        fields = [
            'docs', 
            'category', 
            'location', 
            'is_verified', 
            'is_active',
            'is_featured',
            'application_type',
            'upcoming',
            'search',
        ]
    
    def filter_by_document(self, queryset, name, value):
        """
        Filter jobs by required document type.
        
        Checks if the document is in the required_documents JSONField array.
        """
        if not value:
            return queryset
        
        # Filter where the document type is in the required_documents array
        return queryset.filter(required_documents__contains=value)
    
    def filter_by_search(self, queryset, name, value):
        """
        Full-text search in title and organization name.
        """
        if not value:
            return queryset
        
        return queryset.filter(
            models.Q(title__icontains=value) |
            models.Q(organization_name__icontains=value)
        )
    
    def filter_upcoming(self, queryset, name, value):
        """
        Filter to show only jobs with upcoming deadlines.
        """
        if not value:
            return queryset
        
        from django.utils import timezone
        return queryset.filter(deadline__gte=timezone.now())


# Import models for Q object
from django.db import models
