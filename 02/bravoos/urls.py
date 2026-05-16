from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="BravoOS API",
      default_version='v1',
      description="API documentation for BravoOS",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@bravoos.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('apps.accounts.urls')),
   # App API routes
   path('api/inventory/', include('apps.inventory.urls')),
   path('api/analytics/', include('apps.analytics.urls')),
   path('api/tasks/', include('apps.tasks.urls')),
   path('api/supply-chain/', include('apps.supply_chain.urls')),
   path('api/waste/', include('apps.waste_management.urls')),
   path('api/shifts/', include('shifts.urls')),
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
