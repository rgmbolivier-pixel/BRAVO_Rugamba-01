from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShiftViewSet, ShiftRequestViewSet

router = DefaultRouter()
router.register(r'shifts', ShiftViewSet)
router.register(r'requests', ShiftRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
