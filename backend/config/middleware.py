from urllib.parse import quote

from django.contrib.auth import logout
from django.shortcuts import redirect


class StrictAdminAccessMiddleware:
    """
    Enforce authentication before entering admin routes.
    Ensures unauthenticated users are always prompted to sign in and
    only active superusers can continue to the admin index.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path

        # Force fresh login page when requested from the landing CTA.
        if path == "/admin/login/" and request.GET.get("force") == "1":
            logout(request)

        # Clear admin console session marker when leaving admin.
        if path == "/admin/logout/":
            request.session.pop("admin_console_authenticated", None)

        if path.startswith("/admin/"):
            allowed_exact_paths = {"/admin/login/", "/admin/logout/"}
            allowed_prefixes = ("/admin/jsi18n/", "/admin/static/")
            if path not in allowed_exact_paths and not path.startswith(allowed_prefixes):
                user = getattr(request, "user", None)
                next_param = quote(request.get_full_path())
                login_url = f"/admin/login/?next={next_param}"

                if not user or not user.is_authenticated:
                    return redirect(login_url)

                if not (user.is_active and user.is_superuser):
                    logout(request)
                    return redirect(login_url)

                # Require a dedicated admin-console login session, not just generic site auth.
                if not request.session.get("admin_console_authenticated"):
                    logout(request)
                    return redirect(f"/admin/login/?force=1&next={next_param}")
        response = self.get_response(request)

        # Mark session only after successful admin login.
        if path == "/admin/login/" and request.method == "POST":
            user = getattr(request, "user", None)
            if user and user.is_authenticated and user.is_active and user.is_superuser:
                request.session["admin_console_authenticated"] = True

        return response
