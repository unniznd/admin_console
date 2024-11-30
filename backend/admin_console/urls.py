from django.urls import path

from . import views

urlpatterns = [
    path('users/', views.UserView.as_view(), name='users'),
    path('roles/', views.RoleView.as_view(), name='roles'),

    
    path('logs/', views.get_logs, name='logs'),
]
