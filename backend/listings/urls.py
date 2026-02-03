"""
Listings URL Configuration.
Updated to match Next.js frontend naming conventions.
"""

from django.urls import path
from . import views

app_name = 'listings'

urlpatterns = [
    # 1. Main Opportunities List (Matches: /api/opportunities/)
    # Handles both the full list and filtered featured list via query params
    path('opportunities/', views.JobListView.as_view(), name='opportunity-list'),
    
    # 2. Featured Opportunities (Specific endpoint if you prefer this over query params)
    # Matches: /api/opportunities/featured/
    path('opportunities/featured/', views.FeaturedJobsView.as_view(), name='opportunity-featured'),

    # 3. Opportunity Detail (Matches: /api/opportunities/<id>/)
    path('opportunities/<int:pk>/', views.JobDetailView.as_view(), name='opportunity-detail'),
    
    # 4. Protected brochure download (Matches: /api/opportunities/<id>/brochure/)
    path('opportunities/<int:job_id>/brochure/', views.ProtectedBrochureView.as_view(), name='brochure'),
    
    # 5. Click tracking (Matches: /api/track-click/)
    path('track-click/', views.TrackClickView.as_view(), name='track-click'),
    
    # 6. Analytics (Matches: /api/analytics/)
    path('analytics/', views.AnalyticsOverviewView.as_view(), name='analytics'),
]