from rest_framework import viewsets
from .models import Opportunity, Partner
from .serializers import OpportunitySerializer, PartnerSerializer
from django_filters.rest_framework import DjangoFilterBackend

class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_featured', 'category', 'location', 'is_verified']
