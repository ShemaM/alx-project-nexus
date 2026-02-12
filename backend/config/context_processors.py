from django.conf import settings
from django.db import connection
from django.utils import timezone


def admin_dashboard_context(request):
    """
    Provide lightweight admin dashboard stats for branded templates.
    """
    if not request.path.startswith("/admin/"):
        return {}

    user = getattr(request, "user", None)
    if not user or not user.is_authenticated or not user.is_superuser:
        return {}

    # Lazy imports to avoid startup dependency issues.
    from listings.models import Job, ClickAnalytics, Partner, Subscription

    now = timezone.localtime()
    period = "morning" if now.hour < 12 else "afternoon" if now.hour < 18 else "evening"
    name = (user.first_name or user.get_username() or "Admin").strip().split(" ")[0]

    total_jobs = Job.objects.count()
    active_jobs = Job.objects.filter(is_active=True).count()
    verified_jobs = Job.objects.filter(is_verified=True).count()
    partners = Partner.objects.count()
    active_subscribers = Subscription.objects.filter(is_active=True).count()
    total_clicks = sum(ClickAnalytics.objects.values_list("click_count", flat=True))
    latest_jobs = list(
        Job.objects.order_by("-created_at").values("id", "title", "organization_name", "created_at")[:6]
    )

    # Basic system health indicators
    db_status = "Healthy"
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception:
        db_status = "Degraded"

    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    created_today = Job.objects.filter(created_at__gte=today_start).count()

    return {
        "admin_greeting": f"Good {period}, {name}. Welcome.",
        "admin_metrics": {
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "verified_jobs": verified_jobs,
            "partners": partners,
            "active_subscribers": active_subscribers,
            "total_clicks": total_clicks,
            "created_today": created_today,
        },
        "admin_latest_jobs": latest_jobs,
        "admin_system_health": {
            "database": db_status,
            "timezone": str(timezone.get_current_timezone()),
            "debug_mode": "On" if settings.DEBUG else "Off",
        },
    }
