import os
from django.http import JsonResponse
from django.shortcuts import render
from django.conf import settings


def admin_portal_landing(request):
    """
    Branded backend landing page at `/`.
    Guides admins to the correct next step instead of showing a generic page.
    """
    context = {
        "admin_login_url": "/admin/login/?next=/admin/&force=1",
        "admin_home_url": "/admin/",
    }
    return render(request, "admin_portal_landing.html", context)


def health_check(request):
    """
    Health check endpoint for monitoring and connectivity verification.
    Returns basic system status and configuration info for debugging.
    """
    # Get request origin for CORS debugging
    origin = request.META.get('HTTP_ORIGIN', 'No origin header')
    
    # Check database connectivity
    db_status = "ok"
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    response_data = {
        "status": "healthy",
        "service": "byn-k-backend",
        "database": db_status,
        "debug_mode": settings.DEBUG,
        "cors_config": {
            "request_origin": origin,
            "allowed_origins": settings.CORS_ALLOWED_ORIGINS,
            "credentials_allowed": settings.CORS_ALLOW_CREDENTIALS,
        },
        "environment": {
            "frontend_url": settings.FRONTEND_URL,
            "backend_url": os.environ.get('BACKEND_PUBLIC_URL', 'not set'),
            "allowed_hosts": settings.ALLOWED_HOSTS,
        },
    }
    
    response = JsonResponse(response_data)
    # Add CORS headers for health check - only allow configured origins or same-origin requests
    if origin != 'No origin header' and (
        origin in settings.CORS_ALLOWED_ORIGINS or 
        any(origin.endswith(allowed) for allowed in ['.onrender.com', '.vercel.app', 'localhost'])
    ):
        response["Access-Control-Allow-Origin"] = origin
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response
