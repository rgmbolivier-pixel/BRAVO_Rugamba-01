from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WasteRecordViewSet

router = DefaultRouter()
router.register(r'records', WasteRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
