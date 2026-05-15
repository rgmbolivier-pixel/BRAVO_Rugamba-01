from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Vendor, PurchaseOrder, Invoice
from .serializers import VendorSerializer, PurchaseOrderSerializer, InvoiceSerializer
from apps.inventory.models import StockItem, Product
from datetime import datetime, timedelta

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticated]

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all().order_by('-date')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return PurchaseOrder.objects.all().order_by('-date')
        return PurchaseOrder.objects.filter(branch=user.branch).order_by('-date')

    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        po = self.get_object()
        if po.status == 'delivered':
            return Response({"error": "PO already delivered"}, status=status.HTTP_400_BAD_REQUEST)
        
        received_items = request.data.get('items', []) # Expected: [{"product_id": id, "quantity": q, "expiry": "YYYY-MM-DD"}]
        
        for item in received_items:
            product_id = item.get('product_id')
            qty = item.get('quantity')
            expiry = item.get('expiry')
            
            try:
                product = Product.objects.get(id=product_id)
                # Add to stock
                StockItem.objects.create(
                    product=product,
                    branch=po.branch,
                    quantity=qty,
                    expiry_date=expiry or (datetime.now().date() + timedelta(days=30)),
                    storage_location='Receiving Area',
                    status='active'
                )
            except Product.DoesNotExist:
                continue
        
        po.status = 'delivered'
        po.save()
        return Response({"status": "success", "message": "Purchase order received and stock updated"})

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-due_date')
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Invoice.objects.all().order_by('-due_date')
        return Invoice.objects.filter(po__branch=user.branch).order_by('-due_date')
