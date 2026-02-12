from django.shortcuts import render


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
