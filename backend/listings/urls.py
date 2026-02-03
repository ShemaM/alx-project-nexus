"""
Listings URL Configuration.
"""

from django.urls import path
from . import views

app_name = 'listings'

urlpatterns = [
    # Job listings endpoints
    path('jobs/', views.JobListView.as_view(), name='job-list'),
    path('jobs/<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('jobs/featured/', views.FeaturedJobsView.as_view(), name='job-featured'),
    
    # Click tracking endpoint
    path('track-click/', views.TrackClickView.as_view(), name='track-click'),
    
    # Protected brochure download
    path('jobs/<int:job_id>/brochure/', views.ProtectedBrochureView.as_view(), name='brochure'),
    
    # Analytics endpoint (admin only)
    path('analytics/', views.AnalyticsOverviewView.as_view(), name='analytics'),
]
