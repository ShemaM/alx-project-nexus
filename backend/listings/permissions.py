from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    """
    Allow access only to authenticated Django superusers.
    """

    message = "Only super admins can perform this action."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_superuser)
