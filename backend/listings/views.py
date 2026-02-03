"""
Listings API Views.

Implements the Gateway Platform API endpoints.
"""

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Job, ClickAnalytics
from .serializers import (
    JobSerializer, 
    JobListSerializer, 
    ClickAnalyticsSerializer,
    TrackClickSerializer
)
from .filters import JobFilter


class JobListView(generics.ListAPIView):
    """
    List all active job listings.
    
    Supports advanced filtering:
    - ?docs=alien_card - Filter by required documents
    - ?category=scholarship - Filter by category
    - ?location=kenya - Filter by location
    - ?is_verified=true - Filter by verification status
    - ?search=office - Search in title/org name
    """
    
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = JobFilter
    search_fields = ['title', 'organization_name']
    ordering_fields = ['created_at', 'deadline', 'title']
    ordering = ['-created_at']
    
    def list(self, request, *args, **kwargs):
        """Override list to include disclaimer in response."""
        response = super().list(request, *args, **kwargs)
        
        # Add disclaimer to response
        if isinstance(response.data, dict):
            response.data['disclaimer'] = settings.PLATFORM_DISCLAIMER
        else:
            response.data = {
                'results': response.data,
                'disclaimer': settings.PLATFORM_DISCLAIMER
            }
        
        return response


class JobDetailView(generics.RetrieveAPIView):
    """
    Retrieve a single job listing by ID.
    
    Includes full details and the platform disclaimer.
    """
    
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]


class FeaturedJobsView(generics.ListAPIView):
    """
    List featured job listings.
    
    Returns jobs marked as featured for the hero carousel.
    """
    
    queryset = Job.objects.filter(is_active=True, is_featured=True)
    serializer_class = JobListSerializer
    permission_classes = [permissions.AllowAny]
    
    def list(self, request, *args, **kwargs):
        """Override list to include disclaimer."""
        response = super().list(request, *args, **kwargs)
        response.data = {
            'results': response.data if isinstance(response.data, list) else response.data.get('results', []),
            'disclaimer': settings.PLATFORM_DISCLAIMER
        }
        return response


class TrackClickView(APIView):
    """
    Track user clicks/redirects.
    
    Phase 4: Admin "WhatsApp-to-Web" Efficiency
    Increments a counter when users click redirect buttons.
    """
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = TrackClickSerializer(data=request.data)
        
        if serializer.is_valid():
            job_id = serializer.validated_data['job_id']
            click_type = serializer.validated_data['click_type']
            
            try:
                analytics = ClickAnalytics.track_click(job_id, click_type)
                return Response({
                    'success': True,
                    'click_count': analytics.click_count
                })
            except Job.DoesNotExist:
                return Response(
                    {'error': 'Job not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ProtectedBrochureView(APIView):
    """
    Protected media view for PDF brochures.
    
    Phase 3: Security NFRs
    Serves PDF brochures through a view that can check for valid sessions,
    preventing raw file scraping.
    """
    
    permission_classes = [permissions.AllowAny]  # Can be changed to IsAuthenticated
    
    def get(self, request, job_id):
        """Serve the brochure file securely."""
        job = get_object_or_404(Job, id=job_id, is_active=True)
        
        if not job.brochure_upload:
            raise Http404("No brochure available for this job.")
        
        # Track the brochure view
        ClickAnalytics.track_click(job_id, 'view_brochure')
        
        # Serve the file
        file_path = job.brochure_upload.path
        response = FileResponse(
            open(file_path, 'rb'),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'inline; filename="{job.brochure_upload.name}"'
        
        return response


class AnalyticsOverviewView(APIView):
    """
    Analytics overview for admin dashboard.
    
    Returns aggregated click data for all jobs.
    """
    
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        # Get top clicked jobs
        from django.db.models import Sum
        
        top_jobs = Job.objects.annotate(
            total_clicks=Sum('click_analytics__click_count')
        ).filter(
            total_clicks__isnull=False
        ).order_by('-total_clicks')[:10]
        
        data = {
            'total_jobs': Job.objects.filter(is_active=True).count(),
            'verified_jobs': Job.objects.filter(is_active=True, is_verified=True).count(),
            'featured_jobs': Job.objects.filter(is_active=True, is_featured=True).count(),
            'top_clicked': [
                {
                    'id': job.id,
                    'title': job.title,
                    'organization': job.organization_name,
                    'total_clicks': job.total_clicks or 0
                }
                for job in top_jobs
            ],
            'disclaimer': settings.PLATFORM_DISCLAIMER
        }
        
        return Response(data)
