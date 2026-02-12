from django.test import TestCase
from rest_framework.test import APIClient

from .models import User


class LoginViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = 'Testpass123'
        self.user = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password=self.password,
            first_name='User',
        )

    def test_login_with_username(self):
        response = self.client.post(
            '/api/auth/login/',
            {'username': self.user.username, 'password': self.password},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('username'), self.user.username)

    def test_login_with_email(self):
        response = self.client.post(
            '/api/auth/login/',
            {'username': self.user.email, 'password': self.password},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('username'), self.user.username)
