from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from backend.api.models import Opportunity, Partner, Subscription, Category
from django.utils import timezone


class PartnerModelTest(TestCase):
    """Test cases for Partner model."""
    
    def test_partner_creation(self):
        """Test partner can be created with basic fields."""
        partner = Partner.objects.create(
            name="Test Partner",
            website="https://example.com",
            is_active=True
        )
        self.assertEqual(partner.name, "Test Partner")
        self.assertEqual(str(partner), "Test Partner")
    
    def test_partner_opportunity_count(self):
        """Test partner opportunity count property."""
        partner = Partner.objects.create(name="Test Partner")
        self.assertEqual(partner.opportunity_count, 0)
        
        # Create an opportunity
        Opportunity.objects.create(
            title="Test Opportunity",
            organization=partner,
            category="jobs",
            description="Test description",
            is_active=True
        )
        self.assertEqual(partner.opportunity_count, 1)


class OpportunityModelTest(TestCase):
    """Test cases for Opportunity model."""
    
    def setUp(self):
        """Set up test data."""
        self.partner = Partner.objects.create(name="Test Partner")
    
    def test_opportunity_creation(self):
        """Test opportunity can be created with basic fields."""
        opportunity = Opportunity.objects.create(
            title="Software Developer",
            organization=self.partner,
            category="jobs",
            description="A software developer position",
            is_active=True
        )
        self.assertEqual(opportunity.title, "Software Developer")
        self.assertEqual(str(opportunity), "Software Developer")
    
    def test_slug_generation(self):
        """Test that slug is auto-generated from title."""
        opportunity = Opportunity.objects.create(
            title="Software Developer Position",
            organization=self.partner,
            category="jobs",
            description="A software developer position",
            is_active=True
        )
        self.assertEqual(opportunity.slug, "software-developer-position")
    
    def test_unique_slug_generation(self):
        """Test that duplicate titles get unique slugs."""
        opp1 = Opportunity.objects.create(
            title="Software Developer",
            organization=self.partner,
            category="jobs",
            description="First position",
            is_active=True
        )
        opp2 = Opportunity.objects.create(
            title="Software Developer",
            organization=self.partner,
            category="jobs",
            description="Second position",
            is_active=True
        )
        self.assertNotEqual(opp1.slug, opp2.slug)
        self.assertEqual(opp1.slug, "software-developer")
        self.assertEqual(opp2.slug, "software-developer-1")


class SubscriptionModelTest(TestCase):
    """Test cases for Subscription model."""
    
    def test_subscription_creation(self):
        """Test subscription can be created."""
        subscription = Subscription.objects.create(
            email="test@example.com"
        )
        self.assertEqual(subscription.email, "test@example.com")
        self.assertFalse(subscription.is_active)
    
    def test_email_normalization(self):
        """Test that email is normalized to lowercase."""
        subscription = Subscription.objects.create(
            email="TEST@EXAMPLE.COM"
        )
        self.assertEqual(subscription.email, "test@example.com")
    
    def test_subscription_has_tokens(self):
        """Test that subscription has confirmation and unsubscribe tokens."""
        subscription = Subscription.objects.create(
            email="test@example.com"
        )
        self.assertIsNotNone(subscription.confirmation_token)
        self.assertIsNotNone(subscription.unsubscribe_token)


class OpportunityAPITest(APITestCase):
    """Test cases for Opportunity API endpoints."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.partner = Partner.objects.create(name="Test Partner")
        self.opportunity = Opportunity.objects.create(
            title="Test Opportunity",
            organization=self.partner,
            category="jobs",
            description="Test description",
            is_active=True,
            is_featured=True
        )
    
    def test_list_opportunities(self):
        """Test listing opportunities."""
        response = self.client.get('/api/opportunities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_get_opportunity_by_slug(self):
        """Test retrieving opportunity by slug."""
        response = self.client.get(f'/api/opportunities/{self.opportunity.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Opportunity')
    
    def test_filter_by_category(self):
        """Test filtering opportunities by category."""
        response = self.client.get('/api/opportunities/?category=jobs')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        response = self.client.get('/api/opportunities/?category=scholarships')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)
    
    def test_filter_by_featured(self):
        """Test filtering opportunities by featured status."""
        response = self.client.get('/api/opportunities/?is_featured=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)


class SubscriptionAPITest(APITestCase):
    """Test cases for Subscription API endpoints."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
    
    def test_create_subscription(self):
        """Test creating a new subscription."""
        response = self.client.post('/api/subscriptions/', {
            'email': 'test@example.com'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['status'], 'pending_confirmation')
    
    def test_duplicate_subscription(self):
        """Test subscribing with existing email."""
        Subscription.objects.create(email='test@example.com', is_active=True)
        response = self.client.post('/api/subscriptions/', {
            'email': 'test@example.com'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'already_subscribed')
    
    def test_email_normalization_on_subscribe(self):
        """Test that email is normalized on subscription."""
        response = self.client.post('/api/subscriptions/', {
            'email': 'TEST@EXAMPLE.COM'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        subscription = Subscription.objects.get(email='test@example.com')
        self.assertIsNotNone(subscription)


class AuthAPITest(APITestCase):
    """Test cases for Authentication API endpoints."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
    
    def test_register_user(self):
        """Test user registration."""
        response = self.client.post('/api/auth/register/', {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'SecurePass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
    
    def test_register_duplicate_email(self):
        """Test registration with duplicate email."""
        User.objects.create_user(
            username='existing',
            email='existing@example.com',
            password='password123'
        )
        response = self.client.post('/api/auth/register/', {
            'email': 'existing@example.com',
            'username': 'newuser',
            'password': 'SecurePass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_user(self):
        """Test user login."""
        User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123'
        )
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'password123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    def test_login_wrong_password(self):
        """Test login with wrong password."""
        User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123'
        )
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'wrongpassword'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('Incorrect password', response.data['detail'])
    
    def test_login_user_not_found(self):
        """Test login with non-existent user."""
        response = self.client.post('/api/auth/login/', {
            'username': 'nonexistent',
            'password': 'password123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('No account found', response.data['detail'])


class CategoryCountsAPITest(APITestCase):
    """Test cases for Category Counts API endpoint."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.partner = Partner.objects.create(name="Test Partner")
        
        # Create opportunities in different categories
        Opportunity.objects.create(
            title="Job 1",
            organization=self.partner,
            category="jobs",
            description="Test",
            is_active=True
        )
        Opportunity.objects.create(
            title="Scholarship 1",
            organization=self.partner,
            category="scholarships",
            description="Test",
            is_active=True
        )
    
    def test_category_counts(self):
        """Test getting category counts."""
        response = self.client.get('/api/category-counts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['jobs'], 1)
        self.assertEqual(response.data['scholarships'], 1)
        self.assertEqual(response.data['internships'], 0)
        self.assertEqual(response.data['fellowships'], 0)
