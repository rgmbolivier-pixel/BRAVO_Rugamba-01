from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, PurchaseOrderViewSet, InvoiceViewSet

router = DefaultRouter()
router.register(r'vendors', VendorViewSet)
router.register(r'pos', PurchaseOrderViewSet)
router.register(r'invoices', InvoiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
