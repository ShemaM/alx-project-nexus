"""
User URL Configuration.
"""

from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('me/', views.MeView.as_view(), name='me'),
    path('social/', views.SocialLoginRouterView.as_view(), name='social-login'),
    path('social/google/', views.GoogleSocialLoginView.as_view(), name='google-social-login'),
    path('social/linkedin/', views.LinkedInSocialLoginView.as_view(), name='linkedin-social-login'),
]
