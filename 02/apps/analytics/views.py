from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from .gemini_service import GeminiAIService
from apps.inventory.models import StockItem, Branch, Product, Category, Alert, Transfer
from apps.inventory.serializers import StockItemSerializer, BranchSerializer
from apps.tasks.models import Task
from shifts.models import Shift
from django.db.models import Sum, Count, Avg
from django.contrib.auth import get_user_model
import logging
import random
from datetime import datetime

User = get_user_model()

logger = logging.getLogger(__name__)

class WastePredictionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({"error": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            stock_item = StockItem.objects.get(id=product_id)
            serializer = StockItemSerializer(stock_item)
            
            ai_service = GeminiAIService()
            historical_data = [] 
            
            prediction = ai_service.generate_waste_prediction(serializer.data, historical_data)
            return Response(prediction)
        except StockItem.DoesNotExist:
            return Response({"error": "Stock item not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"AI Prediction Error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DemandForecastView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        product_id = request.query_params.get('product_id')
        days = int(request.query_params.get('days', 30))
        
        try:
            ai_service = GeminiAIService()
            forecast = ai_service.generate_demand_forecast(product_id, days)
            return Response(forecast)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AnomalyInsightView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        discrepancy_data = request.data
        try:
            ai_service = GeminiAIService()
            insight = ai_service.generate_anomaly_insight(discrepancy_data)
            return Response(insight)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Generate a high-level AI summary of the current system state"""
        user = request.user
        try:
            stock_qs = StockItem.objects.all()
            if user.role != 'admin':
                stock_qs = stock_qs.filter(branch=user.branch)
                
            total_stock = stock_qs.count()
            expiring_soon = stock_qs.filter(status='Expiring').count()
            low_stock = stock_qs.filter(status='Low Stock').count()
            
            ai_service = GeminiAIService()
            prompt = f"""
            Summarize the current BravoOS state for an executive dashboard:
            - Total Inventory Items: {total_stock}
            - Expiring Soon: {expiring_soon}
            - Low Stock Alerts: {low_stock}
            
            Provide a 2-sentence professional summary and 3 key actionable bullet points.
            Return JSON with:
            1. summary_text
            2. actionable_items (list)
            3. system_health_score (0-100)
            """
            
            response = ai_service.model.generate_content(prompt)
            import json
            text = response.text.strip()
            if text.startswith('```json'): text = text[7:-3]
            return Response(json.loads(text))
        except Exception as e:
            return Response({
                "summary_text": "BravoOS AI is currently analyzing your inventory data.",
                "actionable_items": [
                    "Monitor items marked as 'Expiring Soon'",
                    "Review low stock alerts in the inventory panel",
                    "Check recent transfer requests"
                ],
                "system_health_score": 85
            })

class NetworkStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        stock_qs = StockItem.objects.all()
        alert_qs = Alert.objects.all()
        
        if user.role != 'admin':
            stock_qs = stock_qs.filter(branch=user.branch)
            alert_qs = alert_qs.filter(branch=user.branch)
            
        total_saved = stock_qs.filter(status='active').count() * 10
        total_waste = stock_qs.filter(status='Expired').count() * 15
        total_alerts = alert_qs.filter(status='active').count()
        crit_alerts = alert_qs.filter(status='active', alert_level='critical').count()
        
        # Category breakdown
        categories = Category.objects.all()
        waste_by_cat = []
        for cat in categories:
            items = StockItem.objects.filter(product__category=cat, status='Expired')
            if items.exists():
                waste_by_cat.append({
                    'name': cat.name,
                    'value': items.count() * 10,
                    'percentage': random.randint(10, 40) # Mock percentage for now
                })
        
        # Top wasted products
        top_wasted = []
        wasted_items = StockItem.objects.filter(status='Expired').values('product__name').annotate(count=Count('id'), total_val=Sum('product__cost_price')).order_by('-count')[:5]
        for item in wasted_items:
            top_wasted.append({
                'name': item['product__name'],
                'details': f"{item['count']} units (${item['total_val'] or 0}) - Multiple Branches"
            })

        # Profit breakdown
        profit_by_cat = []
        for cat in categories:
            items = StockItem.objects.filter(product__category=cat, status='active')
            if items.exists():
                profit_by_cat.append({
                    'name': cat.name,
                    'value': items.count() * 50,
                    'percentage': random.randint(20, 60)
                })

        total_staff = User.objects.all()
        if user.role != 'admin':
            total_staff = total_staff.filter(branch=user.branch)
        total_staff = total_staff.count()
        
        total_branches = Branch.objects.count()

        return Response({
            'totalSaved': total_saved,
            'totalWaste': total_waste,
            'totalAlerts': total_alerts,
            'critAlerts': crit_alerts,
            'totalStaff': total_staff,
            'totalBranches': total_branches,
            'wasteByCategory': waste_by_cat or [
                {'name': 'Dairy', 'value': 450, 'percentage': 34},
                {'name': 'Produce', 'value': 300, 'percentage': 30},
            ],
            'profitByCategory': profit_by_cat or [
                {'name': 'Dairy', 'value': 45000, 'percentage': 45},
                {'name': 'Produce', 'value': 38000, 'percentage': 38},
            ],
            'topWastedProducts': top_wasted or [
                {'name': '2% Milk', 'details': '234 units ($585) - Downtown, Uptown, Northside'},
                {'name': 'Sourdough Bread', 'details': '189 units ($283) - Downtown, Westside'},
            ]
        })

class BranchPerformanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        branches = Branch.objects.all()
        data = []
        for b in branches:
            stats = {
                'id': b.id,
                'name': b.name,
                'waste': f"${StockItem.objects.filter(branch=b, status='Expired').count() * 20}",
                'saved': f"${StockItem.objects.filter(branch=b, status='active').count() * 10}",
                'alerts': Alert.objects.filter(branch=b, status='active').count(),
                'crit': Alert.objects.filter(branch=b, status='active', alert_level='critical').count(),
                'score': int(b.fefo_compliance_score) or random.randint(70, 95),
                'trend': 'up' if random.random() > 0.5 else 'down'
            }
            data.append(stats)
        return Response(data)

class BravoChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        query = request.data.get('query')
        
        if not query:
            return Response({"error": "query is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Gather context data based on role
        context = {
            "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "user_name": user.full_name or user.username,
            "role": user.role
        }
        
        try:
            if user.role == 'admin':
                context['system_overview'] = {
                    'total_branches': Branch.objects.count(),
                    'total_inventory_items': StockItem.objects.count(),
                    'active_alerts': Alert.objects.filter(status='active').count(),
                    'critical_alerts': Alert.objects.filter(status='active', alert_level='critical').count(),
                    'total_staff': User.objects.count(),
                    'pending_transfers': Transfer.objects.filter(status='pending').count()
                }
                # Top Wasted Categories
                context['top_wasted'] = list(StockItem.objects.filter(status='Expired').values('product__category__name').annotate(count=Count('id')).order_by('-count')[:3])
                
            elif user.role == 'manager':
                branch = user.branch
                if branch:
                    context['branch_performance'] = {
                        'name': branch.name,
                        'city': branch.city,
                        'inventory_health': branch.fefo_compliance_score,
                        'total_items': StockItem.objects.filter(branch=branch).count(),
                        'low_stock_items': StockItem.objects.filter(branch=branch, status='Low Stock').count(),
                        'expiring_items': StockItem.objects.filter(branch=branch, status='Expiring').count(),
                        'active_alerts': Alert.objects.filter(branch=branch, status='active').count()
                    }
                    context['recent_alerts'] = list(Alert.objects.filter(branch=branch, status='active').order_by('-created_at')[:5].values('product__name', 'alert_level', 'ai_recommendation'))
                    context['pending_tasks'] = list(Task.objects.filter(branch=branch, status='pending').values('title', 'priority', 'due_date')[:5])
            
            elif user.role == 'staff':
                context['my_dashboard'] = {
                    'full_name': user.full_name,
                    'branch': user.branch.name if user.branch else "N/A",
                    'pending_tasks_count': Task.objects.filter(assigned_to=user, status='pending').count(),
                    'active_shift': Shift.objects.filter(user=user, end_time__isnull=True).exists()
                }
                context['my_tasks'] = list(Task.objects.filter(assigned_to=user, status='pending').order_by('due_date').values('title', 'priority', 'due_date')[:5])
                context['recent_shifts'] = list(Shift.objects.filter(user=user).order_by('-start_time')[:3].values('start_time', 'end_time', 'status'))

            # Add historical trends for forecasting
            products = Product.objects.all()[:10]
            historical_trends = []
            for p in products:
                stock_items = StockItem.objects.filter(product=p)
                if user.role in ['manager', 'staff'] and user.branch:
                    stock_items = stock_items.filter(branch=user.branch)
                
                total_received = stock_items.aggregate(Sum('received_quantity'))['received_quantity__sum'] or 0
                total_waste = stock_items.filter(status='Expired').aggregate(Sum('quantity'))['quantity__sum'] or 0
                current_stock = stock_items.filter(status__in=['active', 'Low Stock', 'Expiring']).aggregate(Sum('quantity'))['quantity__sum'] or 0
                
                # Estimate sales/demand based on received - current - waste
                estimated_sales = max(0, total_received - current_stock - total_waste)
                
                historical_trends.append({
                    'product_name': p.name,
                    'category': p.category.name if p.category else 'General',
                    'current_stock_level': current_stock,
                    'past_30_days_demand': estimated_sales,
                    'past_30_days_waste': total_waste,
                })
            
            context['historical_trends'] = historical_trends
            context['forecasting_instructions'] = "CRITICAL INSTRUCTION: When asked for a forecast, you MUST generate a realistic, confident prediction based on the 'historical_trends'. Even if the data is mostly zeros or very small, use your industry knowledge to create a plausible forecast. Do NOT complain about 'insufficient historical data' or tell the user to 'record more data'. Provide the forecast in plain, human-readable language (no JSON, no programming terms, no database terms). Talk to the user naturally as an expert retail assistant."

            ai_service = GeminiAIService()
            response_text = ai_service.get_chat_response(query, user.get_role_display(), context)
            
            return Response({"response": response_text})
        except Exception as e:
            logger.error(f"Chat Bot Error: {str(e)}")
            return Response({"error": f"I'm having trouble processing that right now. ({str(e)})"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
