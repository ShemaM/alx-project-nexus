from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import Opportunity, Partner, Subscription, Category
from .serializers import (
    OpportunitySerializer, OpportunityListSerializer,
    PartnerSerializer, SubscriptionSerializer, SubscriptionCreateSerializer,
    CategorySerializer, UserRegistrationSerializer, UserLoginSerializer, UserSerializer
)


class PartnerViewSet(viewsets.ModelViewSet):
    """ViewSet for Partner model with opportunity counts."""
    queryset = Partner.objects.filter(is_active=True)
    serializer_class = PartnerSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_featured', 'is_active']
    search_fields = ['name']
    ordering_fields = ['name', 'id']


class OpportunityViewSet(viewsets.ModelViewSet):
    """ViewSet for Opportunity model with slug-based lookup and filtering."""
    queryset = Opportunity.objects.filter(is_active=True)
    serializer_class = OpportunitySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_featured', 'category', 'location', 'is_verified', 'organization']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['deadline', 'created_at', 'title']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        """Apply additional filtering based on query params."""
        queryset = super().get_queryset()
        
        # Filter by deadline
        deadline_before = self.request.query_params.get('deadline_before')
        deadline_after = self.request.query_params.get('deadline_after')
        if deadline_before:
            queryset = queryset.filter(deadline__lte=deadline_before)
        if deadline_after:
            queryset = queryset.filter(deadline__gte=deadline_after)
        
        # Filter for closing soon (within 7 days)
        closing_soon = self.request.query_params.get('closing_soon')
        if closing_soon and closing_soon.lower() == 'true':
            from datetime import timedelta
            today = timezone.now().date()
            queryset = queryset.filter(
                deadline__gte=today,
                deadline__lte=today + timedelta(days=7)
            )
        
        # Partner filter (by partner ID or name)
        partner = self.request.query_params.get('partner')
        if partner:
            if partner.isdigit():
                queryset = queryset.filter(organization_id=partner)
            else:
                queryset = queryset.filter(organization__name__icontains=partner)
        
        # Type filter (alias for category)
        opp_type = self.request.query_params.get('type')
        if opp_type:
            queryset = queryset.filter(category=opp_type)
        
        return queryset

    def get_serializer_class(self):
        """Use lightweight serializer for list views."""
        if self.action == 'list':
            return OpportunityListSerializer
        return OpportunitySerializer

    def retrieve(self, request, *args, **kwargs):
        """Allow retrieval by slug or ID."""
        lookup_value = kwargs.get(self.lookup_field)
        
        # Try to get by slug first
        try:
            instance = Opportunity.objects.get(slug=lookup_value, is_active=True)
        except Opportunity.DoesNotExist:
            # Fall back to ID lookup
            try:
                instance = Opportunity.objects.get(pk=lookup_value, is_active=True)
            except (Opportunity.DoesNotExist, ValueError):
                return Response(
                    {'detail': 'Opportunity not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Category model with opportunity counts."""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class SubscriptionViewSet(viewsets.GenericViewSet):
    """ViewSet for email subscriptions."""
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        """Create a new subscription."""
        serializer = SubscriptionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        
        # Check if already subscribed
        subscription, created = Subscription.objects.get_or_create(
            email=email,
            defaults={'is_active': False}
        )
        
        if not created:
            if subscription.is_active:
                return Response({
                    'success': True,
                    'message': 'You are already subscribed!',
                    'status': 'already_subscribed'
                })
            else:
                return Response({
                    'success': True,
                    'message': 'Please check your email to confirm your subscription.',
                    'status': 'pending_confirmation'
                })
        
        # TODO: Send confirmation email
        
        return Response({
            'success': True,
            'message': 'Please check your email to confirm your subscription.',
            'status': 'pending_confirmation'
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='confirm/(?P<token>[^/.]+)')
    def confirm(self, request, token=None):
        """Confirm a subscription using the token."""
        try:
            subscription = Subscription.objects.get(confirmation_token=token)
            if subscription.is_active:
                return Response({
                    'success': True,
                    'message': 'Your subscription is already confirmed.',
                    'status': 'already_confirmed'
                })
            subscription.is_active = True
            subscription.confirmed_at = timezone.now()
            subscription.save()
            return Response({
                'success': True,
                'message': 'Your subscription has been confirmed!',
                'status': 'confirmed'
            })
        except Subscription.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invalid or expired confirmation link.',
                'status': 'pending_confirmation'
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='unsubscribe/(?P<token>[^/.]+)')
    def unsubscribe(self, request, token=None):
        """Unsubscribe using the token."""
        try:
            subscription = Subscription.objects.get(unsubscribe_token=token)
            if not subscription.is_active:
                return Response({
                    'success': True,
                    'message': 'You are already unsubscribed.',
                    'status': 'already_unsubscribed'
                })
            subscription.is_active = False
            subscription.save()
            return Response({
                'success': True,
                'message': 'You have been unsubscribed successfully.',
                'status': 'unsubscribed'
            })
        except Subscription.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invalid unsubscribe link.',
                'status': 'unsubscribed'
            }, status=status.HTTP_400_BAD_REQUEST)


# Authentication Views

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user with hashed password."""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'success': True,
            'message': 'Account created successfully.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    # Extract the first error message for better UX
    errors = serializer.errors
    error_message = 'Registration failed.'
    if 'email' in errors:
        error_message = errors['email'][0]
    elif 'username' in errors:
        error_message = errors['username'][0]
    elif 'password' in errors:
        error_message = errors['password'][0]
    
    return Response({
        'success': False,
        'detail': error_message,
        'errors': errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Authenticate a user and return user data."""
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    username = serializer.validated_data['username']
    password = serializer.validated_data['password']
    
    # Try to find user by username or email
    user = None
    try:
        if '@' in username:
            # Login by email
            user_obj = User.objects.get(email=username)
            user = authenticate(username=user_obj.username, password=password)
        else:
            # Login by username
            user = authenticate(username=username, password=password)
    except User.DoesNotExist:
        pass
    
    if user is None:
        # Distinguish between user not found and wrong password
        try:
            if '@' in username:
                User.objects.get(email=username)
            else:
                User.objects.get(username=username)
            # User exists but wrong password
            return Response({
                'success': False,
                'detail': 'Incorrect password. Please try again.'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'detail': 'No account found with this email/username.'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.is_active:
        return Response({
            'success': False,
            'detail': 'This account has been deactivated.'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({
        'success': True,
        'message': 'Login successful.',
        'user': UserSerializer(user).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get the currently authenticated user."""
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
def logout_user(request):
    """Log out the current user."""
    return Response({
        'success': True,
        'message': 'Logged out successfully.'
    })


# Category counts endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def get_category_counts(request):
    """Get opportunity counts per category."""
    counts = Opportunity.objects.filter(is_active=True).values('category').annotate(
        count=Count('id')
    )
    
    # Build response with all categories
    result = {
        'jobs': 0,
        'scholarships': 0,
        'internships': 0,
        'fellowships': 0,
    }
    
    for item in counts:
        category = item['category']
        if category in result:
            result[category] = item['count']
    
    # Add partner count
    result['partners'] = Partner.objects.filter(is_active=True).count()
    
    return Response(result)
