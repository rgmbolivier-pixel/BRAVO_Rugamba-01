from django.contrib import admin
from .models import Branch, Category, Product, StockItem, Alert

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'branch_code', 'city', 'status', 'risk_score')
    search_fields = ('name', 'branch_code', 'city')
    list_filter = ('status', 'city')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent_category', 'is_active')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'unit', 'cost_price', 'selling_price', 'is_active')
    search_fields = ('name', 'sku', 'barcode')
    list_filter = ('category', 'is_active', 'is_perishable')

@admin.register(StockItem)
class StockItemAdmin(admin.ModelAdmin):
    list_display = ('product', 'branch', 'batch_number', 'quantity', 'expiry_date', 'status')
    search_fields = ('product__name', 'batch_number')
    list_filter = ('branch', 'status', 'expiry_date')

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('product', 'branch', 'alert_level', 'quantity_at_risk', 'status')
    list_filter = ('alert_level', 'status', 'branch')
