from django.contrib import admin
from django.urls import path, include
from admin_console.views import CustomAuthToken, get_user_data

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Backend API",
      default_version='v1',
      description="Admin Console API Documentation",
      terms_of_service="http://localhost:8000/redoc/",
      contact=openapi.Contact(email="au6695@gmail.com"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    path('admin/', admin.site.urls),
    path('api/admin/', include('admin_console.urls')),
    path('api/login/', CustomAuthToken.as_view(), name='login'),
    path('api/user/', get_user_data, name="get-user-data")
]
