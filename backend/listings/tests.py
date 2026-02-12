"""
Tests for the listings app.
"""

from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from django.core.management import call_command
from datetime import timedelta
from io import StringIO
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
        response = self.client.get('/api/opportunities/')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Should return only active jobs
        self.assertEqual(data['count'], 2)
        
        # Should include disclaimer
        self.assertIn('disclaimer', data)
        self.assertIn('gateway service', data['disclaimer'].lower())
    
    def test_filter_by_category(self):
        """Test filtering by category."""
        response = self.client.get('/api/opportunities/?category=scholarship')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Scholarship Opportunity')
    
    def test_filter_by_docs(self):
        """Test filtering by required documents."""
        response = self.client.get('/api/opportunities/?docs=ctd')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Software Developer')
    
    def test_search_filter(self):
        """Test search functionality."""
        response = self.client.get('/api/opportunities/?search=software')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Software Developer')
    
    def test_job_detail(self):
        """Test retrieving a single job."""
        response = self.client.get(f'/api/opportunities/{self.job1.id}/')
        
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


class SubscriptionModelTests(TestCase):
    """Tests for the Subscription model."""
    
    def test_subscription_creation(self):
        """Test that a subscription can be created."""
        from .models import Subscription
        
        subscription = Subscription.objects.create(email='test@example.com')
        
        self.assertEqual(subscription.email, 'test@example.com')
        self.assertFalse(subscription.is_active)
        self.assertIsNotNone(subscription.confirmation_token)
    
    def test_subscription_confirm(self):
        """Test confirming a subscription."""
        from .models import Subscription
        
        subscription = Subscription.objects.create(email='test@example.com')
        self.assertFalse(subscription.is_active)
        
        subscription.confirm()
        
        self.assertTrue(subscription.is_active)
        self.assertIsNotNone(subscription.confirmed_at)
    
    def test_subscription_unsubscribe(self):
        """Test unsubscribing."""
        from .models import Subscription
        
        subscription = Subscription.objects.create(email='test@example.com')
        subscription.confirm()
        self.assertTrue(subscription.is_active)
        
        subscription.unsubscribe()
        
        self.assertFalse(subscription.is_active)
    
    def test_regenerate_token(self):
        """Test regenerating the confirmation token."""
        from .models import Subscription
        
        subscription = Subscription.objects.create(email='test@example.com')
        original_token = subscription.confirmation_token
        
        subscription.regenerate_token()
        
        self.assertNotEqual(subscription.confirmation_token, original_token)


class SubscriptionAPITests(TestCase):
    """Tests for the Subscription API endpoints."""
    
    def setUp(self):
        """Create test data."""
        self.client = Client()
    
    def test_subscribe_new_email(self):
        """Test subscribing with a new email."""
        response = self.client.post(
            '/api/subscriptions/',
            data=json.dumps({'email': 'newuser@example.com'}),
            content_type='application/json',
        )
        
        self.assertEqual(response.status_code, 201)
        data = response.json()
        
        self.assertTrue(data['success'])
        self.assertEqual(data['status'], 'pending_confirmation')
    
    def test_subscribe_existing_inactive_email(self):
        """Test subscribing with an existing inactive email."""
        from .models import Subscription
        
        Subscription.objects.create(email='existing@example.com')
        
        response = self.client.post(
            '/api/subscriptions/',
            data=json.dumps({'email': 'existing@example.com'}),
            content_type='application/json',
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertTrue(data['success'])
        self.assertEqual(data['status'], 'pending_confirmation')
    
    def test_subscribe_existing_active_email(self):
        """Test subscribing with an already active email."""
        from .models import Subscription
        
        subscription = Subscription.objects.create(email='active@example.com')
        subscription.confirm()
        
        response = self.client.post(
            '/api/subscriptions/',
            data=json.dumps({'email': 'active@example.com'}),
            content_type='application/json',
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertTrue(data['success'])
        self.assertEqual(data['status'], 'already_subscribed')
    
    def test_confirm_subscription(self):
        """Test confirming a subscription."""
        from .models import Subscription
        
        subscription = Subscription.objects.create(email='confirm@example.com')
        token = subscription.confirmation_token
        
        response = self.client.get(f'/api/subscriptions/confirm/{token}/')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertTrue(data['success'])
        self.assertEqual(data['status'], 'confirmed')
        
        # Verify subscription is now active
        subscription.refresh_from_db()
        self.assertTrue(subscription.is_active)
    
    def test_confirm_invalid_token(self):
        """Test confirming with an invalid token."""
        import uuid
        invalid_token = uuid.uuid4()
        
        response = self.client.get(f'/api/subscriptions/confirm/{invalid_token}/')
        
        self.assertEqual(response.status_code, 404)
    
    def test_unsubscribe(self):
        """Test unsubscribing."""
        from .models import Subscription
        
        subscription = Subscription.objects.create(email='unsub@example.com')
        subscription.confirm()
        token = subscription.confirmation_token
        
        response = self.client.get(f'/api/subscriptions/unsubscribe/{token}/')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertTrue(data['success'])
        self.assertEqual(data['status'], 'unsubscribed')
        
        # Verify subscription is now inactive
        subscription.refresh_from_db()
        self.assertFalse(subscription.is_active)


class JobFilterTests(TestCase):
    """Tests for the extended Job filters."""
    
    def setUp(self):
        """Create test data."""
        self.client = Client()
        
        # Create jobs with new filter fields
        self.remote_job = Job.objects.create(
            title='Remote Developer',
            organization_name='Remote Tech',
            category='job',
            work_mode='remote',
            commitment='full_time',
            target_group='youth',
            education_level='undergraduate',
            funding_type='fully',
            is_paid=True,
            is_active=True,
            is_verified=True,
        )
        
        self.onsite_job = Job.objects.create(
            title='Office Manager',
            organization_name='Local Corp',
            category='internship',
            work_mode='onsite',
            commitment='part_time',
            target_group='refugees',
            education_level='high_school',
            funding_type='none',
            is_paid=False,
            is_active=True,
            is_verified=False,
        )
        
        self.hybrid_job = Job.objects.create(
            title='Scholarship Program',
            organization_name='Education Fund',
            category='scholarship',
            work_mode='hybrid',
            commitment='short_term',
            target_group='women',
            education_level='graduate',
            funding_type='partially',
            is_paid=False,
            is_active=True,
            is_verified=True,
        )
    
    def test_filter_by_work_mode(self):
        """Test filtering by work mode."""
        response = self.client.get('/api/opportunities/?work_mode=remote')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Remote Developer')
    
    def test_filter_by_commitment(self):
        """Test filtering by commitment."""
        response = self.client.get('/api/opportunities/?commitment=part_time')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Office Manager')
    
    def test_filter_by_target_group(self):
        """Test filtering by target group."""
        response = self.client.get('/api/opportunities/?target_group=refugees')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Office Manager')
    
    def test_filter_by_funding_type(self):
        """Test filtering by funding type."""
        response = self.client.get('/api/opportunities/?funding_type=fully')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Remote Developer')
    
    def test_filter_by_is_paid(self):
        """Test filtering by paid status."""
        response = self.client.get('/api/opportunities/?is_paid=true')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Remote Developer')
    
    def test_filter_by_multiple_categories(self):
        """Test filtering by multiple categories (in lookup)."""
        response = self.client.get('/api/opportunities/?categories=job,scholarship')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 2)
        titles = [r['title'] for r in data['results']]
        self.assertIn('Remote Developer', titles)
        self.assertIn('Scholarship Program', titles)
    
    def test_filter_by_multiple_work_modes(self):
        """Test filtering by multiple work modes (in lookup)."""
        response = self.client.get('/api/opportunities/?work_modes=remote,hybrid')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 2)
        titles = [r['title'] for r in data['results']]
        self.assertIn('Remote Developer', titles)
        self.assertIn('Scholarship Program', titles)
    
    def test_filter_by_is_verified_exact_match(self):
        """Test filtering by is_verified (exact boolean match)."""
        response = self.client.get('/api/opportunities/?is_verified=true')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 2)
        for result in data['results']:
            self.assertTrue(result['is_verified'])
    
    def test_search_icontains_title(self):
        """Test search filter uses icontains for titles."""
        response = self.client.get('/api/opportunities/?search=DEVELOPER')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Remote Developer')
    
    def test_search_icontains_description(self):
        """Test search filter uses icontains for descriptions."""
        # Update job with description
        self.remote_job.description = 'Looking for a software engineer'
        self.remote_job.save()
        
        response = self.client.get('/api/opportunities/?search=SOFTWARE')
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Remote Developer')

    def test_search_keyword_matching_in_title(self):
        """Test search tokenizes input and matches title keywords."""
        self.remote_job.title = 'Technical Skills Trainer'
        self.remote_job.save()

        response = self.client.get('/api/opportunities/?search=skills trainer')

        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Technical Skills Trainer')


    def test_search_keyword_matching_with_extra_spaces(self):
        """Test search ignores repeated spaces between keywords."""
        self.remote_job.title = 'Technical Skills Trainer'
        self.remote_job.save()

        response = self.client.get('/api/opportunities/?search=technical%20%20trainer')

        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Technical Skills Trainer')

    def test_search_by_slug(self):
        """Test search matches opportunity slug."""
        self.remote_job.title = 'Technical Skills Trainer'
        self.remote_job.slug = 'technical-skills-trainer'
        self.remote_job.save()

        response = self.client.get('/api/opportunities/?search=technical-skills-trainer')

        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Technical Skills Trainer')

    def test_search_hyphenated_keywords(self):
        """Test search splits hyphenated keywords for title matches."""
        self.remote_job.title = 'Technical Skills Trainer'
        self.remote_job.save()

        response = self.client.get('/api/opportunities/?search=technical-skills')

        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['title'], 'Technical Skills Trainer')


class PlatformManagementAccessTests(TestCase):
    """Platform management routes must be superadmin-only."""

    def setUp(self):
        self.client = Client()
        self.super_admin = User.objects.create_user(
            username='superadmin',
            email='superadmin@example.com',
            password='Testpass123!',
            is_staff=True,
            is_superuser=True,
        )
        self.staff_user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='Testpass123!',
            is_staff=True,
            is_superuser=False,
        )

    def test_analytics_denies_staff_user(self):
        self.client.force_login(self.staff_user)
        response = self.client.get('/api/analytics/')
        self.assertEqual(response.status_code, 403)

    def test_analytics_allows_super_admin(self):
        self.client.force_login(self.super_admin)
        response = self.client.get('/api/analytics/')
        self.assertEqual(response.status_code, 200)

    def test_admin_redirects_anonymous_users_to_login(self):
        response = self.client.get('/admin/')
        self.assertEqual(response.status_code, 302)
        self.assertIn('/admin/login/', response.url)

    def test_admin_denies_staff_user(self):
        self.client.force_login(self.staff_user)
        response = self.client.get('/admin/')
        self.assertEqual(response.status_code, 302)
        self.assertIn('/admin/login/', response.url)

    def test_admin_allows_super_admin(self):
        self.client.force_login(self.super_admin)
        response = self.client.get('/admin/')
        self.assertEqual(response.status_code, 200)


class ConsolidateOpportunitiesCommandTests(TestCase):
    """Tests for the consolidate_opportunities management command."""

    def setUp(self):
        self.target_user = User.objects.create_user(
            username='target-admin',
            email='target@example.com',
            password='Testpass123!',
            is_staff=False,
            is_superuser=False,
            is_admin=False,
        )
        self.other_super = User.objects.create_user(
            username='other-super',
            email='othersuper@example.com',
            password='Testpass123!',
            is_staff=True,
            is_superuser=True,
            is_admin=True,
        )
        self.staff_user = User.objects.create_user(
            username='staff-user',
            email='staffuser@example.com',
            password='Testpass123!',
            is_staff=True,
            is_superuser=False,
            is_admin=True,
        )

        self.job_a = Job.objects.create(
            title='Job A',
            organization_name='Org A',
            created_by=self.other_super,
        )
        self.job_b = Job.objects.create(
            title='Job B',
            organization_name='Org B',
            created_by=self.staff_user,
        )

    def test_exclusive_superadmin_reassigns_and_demotes_others(self):
        stdout = StringIO()
        call_command(
            'consolidate_opportunities',
            username='target-admin',
            promote_existing=True,
            exclusive_superadmin=True,
            stdout=stdout,
        )

        self.target_user.refresh_from_db()
        self.other_super.refresh_from_db()
        self.staff_user.refresh_from_db()
        self.job_a.refresh_from_db()
        self.job_b.refresh_from_db()

        self.assertTrue(self.target_user.is_superuser)
        self.assertTrue(self.target_user.is_staff)
        self.assertFalse(self.other_super.is_superuser)
        self.assertFalse(self.other_super.is_staff)
        self.assertFalse(self.other_super.is_admin)
        self.assertFalse(self.staff_user.is_staff)
        self.assertFalse(self.staff_user.is_admin)
        self.assertEqual(self.job_a.created_by_id, self.target_user.id)
        self.assertEqual(self.job_b.created_by_id, self.target_user.id)

    def test_dry_run_does_not_mutate_users_or_ownership(self):
        original_owner_ids = {
            self.job_a.id: self.job_a.created_by_id,
            self.job_b.id: self.job_b.created_by_id,
        }
        stdout = StringIO()

        call_command(
            'consolidate_opportunities',
            username='target-admin',
            promote_existing=True,
            exclusive_superadmin=True,
            dry_run=True,
            stdout=stdout,
        )

        self.target_user.refresh_from_db()
        self.other_super.refresh_from_db()
        self.staff_user.refresh_from_db()
        self.job_a.refresh_from_db()
        self.job_b.refresh_from_db()

        self.assertFalse(self.target_user.is_superuser)
        self.assertTrue(self.other_super.is_superuser)
        self.assertTrue(self.staff_user.is_staff)
        self.assertEqual(self.job_a.created_by_id, original_owner_ids[self.job_a.id])
        self.assertEqual(self.job_b.created_by_id, original_owner_ids[self.job_b.id])
