"""
Tests for the listings app.
"""

from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
import json

from .models import Job, ClickAnalytics
from users.models import User


class JobModelTests(TestCase):
    """Tests for the Job model."""
    
    def setUp(self):
        """Create a test job."""
        self.job = Job.objects.create(
            title='Test Office Manager',
            organization_name='Test Org',
            location='kenya',
            category='job',
            required_documents=['alien_card', 'ctd'],
            application_type='link',
            external_url='https://example.com/apply',
            prep_checklist=[
                {'item': 'Resume', 'required': True},
                {'item': 'Cover Letter', 'required': True},
            ],
            is_verified=True,
            deadline=timezone.now() + timedelta(days=10),
        )
    
    def test_job_creation(self):
        """Test that a job can be created."""
        self.assertEqual(self.job.title, 'Test Office Manager')
        self.assertEqual(self.job.organization_name, 'Test Org')
        self.assertTrue(self.job.is_verified)
    
    def test_days_until_deadline(self):
        """Test the days_until_deadline property."""
        days = self.job.days_until_deadline
        self.assertIsNotNone(days)
        self.assertGreater(days, 0)
    
    def test_is_expired(self):
        """Test the is_expired property."""
        self.assertFalse(self.job.is_expired)
        
        # Create an expired job
        expired_job = Job.objects.create(
            title='Expired Job',
            organization_name='Test Org',
            deadline=timezone.now() - timedelta(days=1),
        )
        self.assertTrue(expired_job.is_expired)
    
    def test_required_documents_filtering(self):
        """Test filtering by required documents."""
        # Create another job with different documents
        Job.objects.create(
            title='Another Job',
            organization_name='Another Org',
            required_documents=['passport'],
        )
        
        # Filter for jobs with ctd
        jobs_with_ctd = Job.objects.filter(required_documents__icontains='ctd')
        self.assertEqual(jobs_with_ctd.count(), 1)
        self.assertEqual(jobs_with_ctd.first().title, 'Test Office Manager')


class ClickAnalyticsTests(TestCase):
    """Tests for click tracking."""
    
    def setUp(self):
        """Create a test job."""
        self.job = Job.objects.create(
            title='Click Test Job',
            organization_name='Test Org',
        )
    
    def test_track_click(self):
        """Test click tracking."""
        analytics = ClickAnalytics.track_click(self.job.id, 'apply')
        
        self.assertEqual(analytics.click_count, 1)
        self.assertEqual(analytics.click_type, 'apply')
        
        # Track another click
        analytics = ClickAnalytics.track_click(self.job.id, 'apply')
        self.assertEqual(analytics.click_count, 2)
    
    def test_different_click_types(self):
        """Test tracking different click types."""
        ClickAnalytics.track_click(self.job.id, 'apply')
        ClickAnalytics.track_click(self.job.id, 'view_brochure')
        ClickAnalytics.track_click(self.job.id, 'compose_email')
        
        self.assertEqual(ClickAnalytics.objects.filter(job=self.job).count(), 3)


class JobAPITests(TestCase):
    """Tests for the Job API endpoints."""
    
    def setUp(self):
        """Create test data."""
        self.client = Client()
        
        # Create test jobs
        self.job1 = Job.objects.create(
            title='Software Developer',
            organization_name='Tech Corp',
            location='kenya',
            category='job',
            required_documents=['alien_card', 'ctd'],
            application_type='link',
            external_url='https://example.com/apply',
            is_verified=True,
            is_active=True,
            deadline=timezone.now() + timedelta(days=10),
        )
        
        self.job2 = Job.objects.create(
            title='Scholarship Opportunity',
            organization_name='Education Foundation',
            location='remote',
            category='scholarship',
            required_documents=['passport'],
            application_type='email',
            application_email='apply@example.com',
            is_verified=True,
            is_active=True,
            deadline=timezone.now() + timedelta(days=20),
        )
        
        self.job3 = Job.objects.create(
            title='Inactive Job',
            organization_name='Inactive Org',
            is_active=False,
        )
    
    def test_list_jobs(self):
        """Test listing active jobs."""
        response = self.client.get('/api/jobs/')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Should return only active jobs
        self.assertEqual(data['count'], 2)
        
        # Should include disclaimer
        self.assertIn('disclaimer', data)
        self.assertIn('gateway service', data['disclaimer'].lower())
    
    def test_filter_by_category(self):
        """Test filtering by category."""
        response = self.client.get('/api/jobs/?category=scholarship')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Scholarship Opportunity')
    
    def test_filter_by_docs(self):
        """Test filtering by required documents."""
        response = self.client.get('/api/jobs/?docs=ctd')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Software Developer')
    
    def test_search_filter(self):
        """Test search functionality."""
        response = self.client.get('/api/jobs/?search=software')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Software Developer')
    
    def test_job_detail(self):
        """Test retrieving a single job."""
        response = self.client.get(f'/api/jobs/{self.job1.id}/')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['title'], 'Software Developer')
        self.assertIn('disclaimer', data)
    
    def test_track_click_endpoint(self):
        """Test the click tracking endpoint."""
        response = self.client.post(
            '/api/track-click/',
            data=json.dumps({
                'job_id': self.job1.id,
                'click_type': 'apply',
            }),
            content_type='application/json',
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertTrue(data['success'])
        self.assertEqual(data['click_count'], 1)


class UserModelTests(TestCase):
    """Tests for the User model."""
    
    def test_create_regular_user(self):
        """Test creating a regular user."""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
        )
        
        self.assertEqual(user.username, 'testuser')
        self.assertFalse(user.is_admin)
    
    def test_create_admin_user(self):
        """Test creating an admin user."""
        admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            is_admin=True,
        )
        
        self.assertEqual(admin.username, 'admin')
        self.assertTrue(admin.is_admin)
    
    def test_display_name(self):
        """Test the display_name property."""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe',
        )
        
        self.assertEqual(user.display_name, 'John Doe')
        
        # Without names, should return username
        user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='testpass123',
        )
        
        self.assertEqual(user2.display_name, 'testuser2')
