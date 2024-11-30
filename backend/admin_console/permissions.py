from rest_framework.permissions import BasePermission
from .models import Users

class IsAdmin(BasePermission):
    message = {
        'status': 'UNAUTHORIZED',
        'message': 'You are not authorized to perform this action'
    }
    def has_permission(self, request, view):
        try:
            user = Users.objects.get(user=request.user)
            return user.is_admin
        except Users.DoesNotExist:
            return False