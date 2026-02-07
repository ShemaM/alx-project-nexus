from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OpportunityViewSet, PartnerViewSet, SubscriptionViewSet, CategoryViewSet,
    register_user, login_user, logout_user, get_current_user, get_category_counts
)

router = DefaultRouter()
router.register(r'opportunities', OpportunityViewSet)
router.register(r'partners', PartnerViewSet)
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Auth endpoints
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/logout/', logout_user, name='logout'),
    path('auth/me/', get_current_user, name='current-user'),
    # Category counts endpoint
    path('category-counts/', get_category_counts, name='category-counts'),
]
