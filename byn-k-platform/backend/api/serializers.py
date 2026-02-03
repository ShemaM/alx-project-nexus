from rest_framework import serializers
from .models import Opportunity, Partner

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = '__all__'

class OpportunitySerializer(serializers.ModelSerializer):
    organization = PartnerSerializer(read_only=True)

    class Meta:
        model = Opportunity
        fields = '__all__'
