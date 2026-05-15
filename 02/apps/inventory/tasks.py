from celery import shared_task
from apps.analytics.gemini_service import GeminiAIService
from apps.inventory.models import StockItem, Alert, Product
from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg

def calculate_daily_sales_avg(product):
    # Mock calculation for now, in production this would query sales logs
    return 5.5

@shared_task
def check_expiring_stock():
    """Check for products expiring soon and create alerts"""
    service = GeminiAIService()
    
    # Get products expiring within 7 days
    expiring_soon = StockItem.objects.filter(
        expiry_date__lte=timezone.now().date() + timedelta(days=7),
        expiry_date__gte=timezone.now().date(),
        quantity__gt=0
    )
    
    for stock_item in expiring_soon:
        # Check if alert already exists
        if Alert.objects.filter(stock_item=stock_item, status='active').exists():
            continue
        
        # Get historical data for this product (mocked for now)
        historical_data = []
        
        # Get AI prediction
        product_data = {
            'name': stock_item.product.name,
            'current_stock': stock_item.quantity,
            'expiry_date': str(stock_item.expiry_date),
            'daily_sales_avg': calculate_daily_sales_avg(stock_item.product)
        }
        
        try:
            prediction = service.generate_waste_prediction(product_data, historical_data)
            
            # Create alert
            Alert.objects.create(
                stock_item=stock_item,
                branch=stock_item.branch,
                product=stock_item.product,
                alert_level=prediction['risk_level'].upper(),
                quantity_at_risk=prediction['predicted_waste_units'],
                estimated_loss=prediction['predicted_waste_units'] * stock_item.product.cost_price,
                expiry_days_left=(stock_item.expiry_date - timezone.now().date()).days,
                ai_recommendation=prediction['reasoning'],
                recommended_action=prediction['recommended_action'],
                confidence_score=prediction['confidence_score']
            )
        except Exception as e:
            print(f"Error checking stock for {stock_item}: {str(e)}")

@shared_task
def generate_daily_forecasts():
    """Generate demand forecasts for all products"""
    service = GeminiAIService()
    products = Product.objects.filter(is_active=True)
    
    for product in products:
        try:
            forecast = service.generate_demand_forecast(str(product.id), days=30)
            # Logic to store forecast would go here
        except Exception as e:
            print(f"Error forecasting for {product}: {str(e)}")
