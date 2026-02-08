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

    # 6.1 Category counts (Matches: /api/category-counts/)
    path('category-counts/', views.CategoryCountsView.as_view(), name='category-counts'),

    # 6.2 Partners (Matches: /api/partners/)
    path('partners/', views.PartnerListView.as_view(), name='partners'),
    path('partners/<int:pk>/', views.PartnerDetailView.as_view(), name='partner-detail'),
    
    # ============================================
    # Subscription Endpoints
    # ============================================
    
    # 7. Create subscription (Matches: /api/subscriptions/)
    path('subscriptions/', views.SubscriptionCreateView.as_view(), name='subscription-create'),
    
    # 8. Confirm subscription (Matches: /api/subscriptions/confirm/<token>/)
    path('subscriptions/confirm/<uuid:token>/', views.SubscriptionConfirmView.as_view(), name='subscription-confirm'),
    
    # 9. Unsubscribe (Matches: /api/subscriptions/unsubscribe/<token>/)
    path('subscriptions/unsubscribe/<uuid:token>/', views.SubscriptionUnsubscribeView.as_view(), name='subscription-unsubscribe'),
]