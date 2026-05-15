from rest_framework import serializers
from .models import Branch, Category, Product, StockItem, Alert, Transfer

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Product
        fields = '__all__'

class StockItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    branch_name = serializers.ReadOnlyField(source='branch.name')
    
    class Meta:
        model = StockItem
        fields = '__all__'

class AlertSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    category_name = serializers.ReadOnlyField(source='product.category.name')
    sku = serializers.ReadOnlyField(source='product.sku')
    branch_name = serializers.ReadOnlyField(source='branch.name')
    expiry_date = serializers.ReadOnlyField(source='stock_item.expiry_date')
    
    class Meta:
        model = Alert
        fields = '__all__'

class TransferSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    from_branch_name = serializers.ReadOnlyField(source='from_branch.name')
    to_branch_name = serializers.ReadOnlyField(source='to_branch.name')
    received_by_name = serializers.ReadOnlyField(source='received_by.email')
    
    class Meta:
        model = Transfer
        fields = '__all__'
