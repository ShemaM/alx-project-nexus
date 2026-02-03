from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OpportunityViewSet, PartnerViewSet

router = DefaultRouter()
router.register(r'opportunities', OpportunityViewSet)
router.register(r'partners', PartnerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
