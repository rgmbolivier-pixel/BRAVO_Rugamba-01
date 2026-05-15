from rest_framework import serializers, viewsets, permissions
from .models import WasteRecord

class WasteRecordSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='stock_item.product.name')
    logged_by_name = serializers.ReadOnlyField(source='logged_by.email')
    
    class Meta:
        model = WasteRecord
        fields = '__all__'

class WasteRecordViewSet(viewsets.ModelViewSet):
    queryset = WasteRecord.objects.all()
    serializer_class = WasteRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return WasteRecord.objects.all()
        return WasteRecord.objects.filter(branch=user.branch)
    
    def perform_create(self, serializer):
        serializer.save(logged_by=self.request.user)
