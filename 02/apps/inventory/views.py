from rest_framework import viewsets, permissions, status
from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Branch, Category, Product, StockItem, Alert, Transfer
from .serializers import (
    BranchSerializer, CategorySerializer, ProductSerializer, 
    StockItemSerializer, AlertSerializer, TransferSerializer
)
from apps.analytics.gemini_service import GeminiAIService
from datetime import datetime, timedelta

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [permissions.IsAuthenticated]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

class StockItemViewSet(viewsets.ModelViewSet):
    queryset = StockItem.objects.all()
    serializer_class = StockItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return StockItem.objects.all()
        return StockItem.objects.filter(branch=user.branch)

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by('-created_at')
    serializer_class = AlertSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Alert.objects.all().order_by('-created_at')
        return Alert.objects.filter(branch=user.branch).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        AI-powered alert generation. Scans inventory and uses Gemini to analyze risk.
        """
        ai_service = GeminiAIService()
        # Scan for items expiring in the next 14 days
        threshold = datetime.now().date() + timedelta(days=14)
        expiring_items = StockItem.objects.filter(expiry_date__lte=threshold, status='active')
        
        alerts_created = 0
        for item in expiring_items:
            # Avoid duplicate active alerts for the same item
            if Alert.objects.filter(stock_item=item, status='active').exists():
                continue
            
            days_left = (item.expiry_date - datetime.now().date()).days
            
            # Prepare data for AI analysis
            item_data = {
                "name": item.product.name,
                "current_stock": item.quantity,
                "expiry_date": str(item.expiry_date),
                "daily_sales_avg": 5, # Placeholder
                "unit_cost": float(item.product.cost_price),
                "branch": item.branch.name
            }
            
            # Get AI recommendation
            ai_analysis = ai_service.generate_waste_prediction(item_data, [])
            
            Alert.objects.create(
                stock_item=item,
                branch=item.branch,
                product=item.product,
                alert_level='critical' if days_left <= 3 else 'high',
                quantity_at_risk=item.quantity,
                estimated_loss=item.quantity * item.product.cost_price,
                expiry_days_left=days_left,
                ai_recommendation=ai_analysis.get('reasoning', 'Monitor closely'),
                recommended_action=ai_analysis.get('recommended_action', 'discount').upper(),
                confidence_score=ai_analysis.get('confidence_score', 85),
                status='active'
            )
            alerts_created += 1
            
        return Response({"status": "success", "alerts_created": alerts_created})

class TransferViewSet(viewsets.ModelViewSet):
    queryset = Transfer.objects.all().order_by('-created_at')
    serializer_class = TransferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Transfer.objects.all().order_by('-created_at')
        return Transfer.objects.filter(
            Q(from_branch=user.branch) | Q(to_branch=user.branch)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        # Additional logic for inventory deduction can be added here
        serializer.save()
