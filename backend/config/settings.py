"""
Django settings for BYN-K Platform backend.

This is a Gateway Platform - we do not process applications;
we curate opportunities from WhatsApp/PDFs and redirect users
to external NGO portals (Forms, Emails, Websites).
"""

import os
import warnings
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

# Silence known deprecation warnings emitted by dj-rest-auth on allauth>=65.
warnings.filterwarnings(
    "ignore",
    message=r"app_settings\.USERNAME_REQUIRED is deprecated, use: app_settings\.SIGNUP_FIELDS\['username'\]\['required'\]",
    category=UserWarning,
    module=r"dj_rest_auth\.registration\.serializers",
)
warnings.filterwarnings(
    "ignore",
    message=r"app_settings\.EMAIL_REQUIRED is deprecated, use: app_settings\.SIGNUP_FIELDS\['email'\]\['required'\]",
    category=UserWarning,
    module=r"dj_rest_auth\.registration\.serializers",
)

# Load environment variables
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Security settings
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-change-this-in-production')
DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'

# Allowed Hosts
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1,.onrender.com').split(',')

# Application definition
INSTALLED_APPS = [
    # Django Unfold Admin Theme (must be before django.contrib.admin)
    'unfold',
    'unfold.contrib.filters',
    # Django core apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_filters',
    'django_celery_results',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.linkedin_oauth2',
    # Local apps
    'users',
    'listings',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be at the top
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'listings.middleware.DisclaimerMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database Configuration for Render/Local
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600
    )
}

# Custom User Model
AUTH_USER_MODEL = 'users.User'
SITE_ID = int(os.environ.get('SITE_ID', 1))

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'
USE_I18N = True
USE_TZ = True

# Static Files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATICFILES_DIRS = [BASE_DIR / 'static']

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ============================================
# CORS & CSRF Configuration
# ============================================
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://opportunities-for-banyamulenge-yout.vercel.app',
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://opportunities-for-banyamulenge-yout.vercel.app',
    'https://nexus-backend-lkps.onrender.com',
]

CORS_ALLOW_CREDENTIALS = True

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# Platform Disclaimer
PLATFORM_DISCLAIMER = (
    "DISCLAIMER: BYN-K Platform is a gateway service that curates and shares "
    "opportunities from various sources. We are NOT the hiring entity, scholarship "
    "provider, or organization offering these opportunities. We do not process "
    "applications. All applications are submitted directly to the respective "
    "organizations through their official channels. Please verify all information "
    "with the official source before applying."
)

# ============================================
# Session & Security Settings
# ============================================
SESSION_COOKIE_AGE = 86400  # 24 hours
SESSION_SAVE_EVERY_REQUEST = True

LOGIN_URL = '/admin/login/'
LOGIN_REDIRECT_URL = '/admin/'
LOGOUT_REDIRECT_URL = '/admin/login/'

if not DEBUG:
    # HTTPS/SSL settings
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    
    # Session & CSRF cookie security
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    CSRF_COOKIE_SECURE = True
    CSRF_COOKIE_HTTPONLY = True
    CSRF_COOKIE_SAMESITE = 'Lax'
    
    # Additional security headers
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
else:
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    X_FRAME_OPTIONS = 'DENY'

# ============================================
# Admin Site Customization
# ============================================
ADMIN_SITE_HEADER = "Banyamulenge Youth Kenya (BYN-K) Admin"
ADMIN_SITE_TITLE = "BYN-K Admin"
ADMIN_INDEX_TITLE = "Platform Management"

# ============================================
# Email Configuration
# ============================================
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'Banyamulenge Youth Kenya <noreply@bynk.org>'


# ============================================
# Celery Configuration
# ============================================
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = 'django-db'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Africa/Nairobi'
CELERY_BEAT_SCHEDULE = {
    'send-new-opportunity-notifications-every-day': {
        'task': 'listings.tasks.send_new_opportunity_notifications',
        'schedule': 86400.0,  # every 24 hours
    },
}

REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': os.environ.get('JWT_AUTH_COOKIE', 'bynk_access'),
    'JWT_AUTH_REFRESH_COOKIE': os.environ.get('JWT_AUTH_REFRESH_COOKIE', 'bynk_refresh'),
}

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('Bearer',),
}

ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']
ACCOUNT_EMAIL_VERIFICATION = 'optional'
SOCIALACCOUNT_QUERY_EMAIL = True
SOCIALACCOUNT_LOGIN_ON_GET = True

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['openid', 'email', 'profile'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'APP': {
            'client_id': os.environ.get('GOOGLE_CLIENT_ID', ''),
            'secret': os.environ.get('GOOGLE_CLIENT_SECRET', ''),
            'key': '',
        },
    },
    'linkedin_oauth2': {
        'SCOPE': ['openid', 'profile', 'email'],
        'APP': {
            'client_id': os.environ.get('LINKEDIN_CLIENT_ID', ''),
            'secret': os.environ.get('LINKEDIN_CLIENT_SECRET', ''),
            'key': '',
        },
    },
}

GOOGLE_REDIRECT_URI = os.environ.get('GOOGLE_REDIRECT_URI', 'http://localhost:3000/api/auth/callback/google')
LINKEDIN_REDIRECT_URI = os.environ.get('LINKEDIN_REDIRECT_URI', 'http://localhost:3000/api/auth/callback/linkedin')
