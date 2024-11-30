from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    message = {
        'status': 'UNAUTHORIZED',
        'message': 'You are not authorized to perform this action'
    }
    def has_permission(self, request, view):
        return request.user and request.user.is_admin