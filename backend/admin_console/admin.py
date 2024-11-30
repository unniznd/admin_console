from django.contrib import admin
from .models import Roles, Users, Logs

@admin.register(Roles)
class RolesAdmin(admin.ModelAdmin):
    list_display = ('id', 'role')

@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'is_admin', 'is_active', 'role')

    def role(self, obj):
        return obj.role.role

@admin.register(Logs)
class LogsAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'action', 'date')

