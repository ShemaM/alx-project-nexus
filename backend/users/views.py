"""
User API Views.
"""

import os
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from rest_framework.test import APIRequestFactory
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.linkedin_oauth2.views import LinkedInOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from .models import User
from .serializers import UserSerializer, UserCreateSerializer


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(APIView):
    """User login endpoint."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        identifier = (request.data.get('username') or request.data.get('email') or '').strip()
        password = request.data.get('password')
        
        if not identifier or not password:
            return Response(
                {'error': 'Username/email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = identifier
        if '@' in identifier:
            matched_user = User.objects.filter(email__iexact=identifier).first()
            if matched_user:
                username = matched_user.username
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        
        return Response(
            {'error': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(APIView):
    """User logout endpoint."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        logout(request)
        response = Response({'message': 'Logged out successfully.'})

        cookie_names = [
            settings.SESSION_COOKIE_NAME,
            settings.CSRF_COOKIE_NAME,
            os.environ.get('JWT_AUTH_COOKIE', 'bynk_access'),
            os.environ.get('JWT_AUTH_REFRESH_COOKIE', 'bynk_refresh'),
            'auth-token',
            'payload-token',
            'next-auth.session-token',
            '__Secure-next-auth.session-token',
            'next-auth.csrf-token',
            '__Host-next-auth.csrf-token',
            'next-auth.callback-url',
            '__Secure-next-auth.callback-url',
        ]

        for cookie_name in cookie_names:
            response.delete_cookie(cookie_name, path='/')
            response.delete_cookie(cookie_name, path='/api')

        return response


class MeView(generics.RetrieveUpdateAPIView):
    """Current user profile endpoint."""
    
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class GoogleSocialLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = getattr(settings, 'GOOGLE_REDIRECT_URI', 'http://localhost:3000/api/auth/callback/google')


class LinkedInSocialLoginView(SocialLoginView):
    adapter_class = LinkedInOAuth2Adapter
    client_class = OAuth2Client
    callback_url = getattr(settings, 'LINKEDIN_REDIRECT_URI', 'http://localhost:3000/api/auth/callback/linkedin')


class SocialLoginRouterView(APIView):
    """
    Provider-agnostic social login endpoint.
    Expects: { provider: "google"|"linkedin", access_token?: str, code?: str }
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        provider = (request.data.get('provider') or '').strip().lower()
        access_token = request.data.get('access_token')
        code = request.data.get('code')

        if provider not in ('google', 'linkedin'):
            return Response(
                {'error': 'Unsupported provider. Use "google" or "linkedin".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not access_token and not code:
            return Response(
                {'error': 'Either access_token or code is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = {}
        if access_token:
            payload['access_token'] = access_token
        if code:
            payload['code'] = code

        target_view = (
            GoogleSocialLoginView.as_view()
            if provider == 'google'
            else LinkedInSocialLoginView.as_view()
        )

        factory = APIRequestFactory()
        proxy_request = factory.post('/api/auth/social/', payload, format='json')
        proxy_request.COOKIES = request.COOKIES

        response = target_view(proxy_request)
        return response
