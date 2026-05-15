from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, StockItemViewSet, AlertViewSet, BranchViewSet, TransferViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'stock', StockItemViewSet)
router.register(r'alerts', AlertViewSet)
router.register(r'branches', BranchViewSet)
router.register(r'transfers', TransferViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
