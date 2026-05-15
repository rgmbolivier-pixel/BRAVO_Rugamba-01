from rest_framework import serializers
from .models import Vendor, PurchaseOrder, Invoice

class PurchaseOrderSerializer(serializers.ModelSerializer):
    vendor_name = serializers.ReadOnlyField(source='vendor.name')
    branch_name = serializers.ReadOnlyField(source='branch.name')
    
    class Meta:
        model = PurchaseOrder
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    vendor_name = serializers.ReadOnlyField(source='po.vendor.name')
    po_code = serializers.ReadOnlyField(source='po.code')
    
    class Meta:
        model = Invoice
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    recent_pos = serializers.SerializerMethodField()
    active_pos_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Vendor
        fields = '__all__'
        
    def get_recent_pos(self, obj):
        pos = obj.purchase_orders.all().order_by('-date')[:3]
        return PurchaseOrderSerializer(pos, many=True).data

    def get_active_pos_count(self, obj):
        return obj.purchase_orders.filter(status='pending').count()
