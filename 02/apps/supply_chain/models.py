from django.db import models
from apps.inventory.models import Branch, Product

class Vendor(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Under Review', 'Under Review'),
        ('Suspended', 'Suspended'),
    ]
    
    vendor_code = models.CharField(max_length=20, unique=True, blank=True, null=True)
    name = models.CharField(max_length=200)
    name_az = models.CharField(max_length=200, blank=True, null=True)
    contact_person = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    tax_number = models.CharField(max_length=50, blank=True, null=True)
    categories = models.JSONField(default=list) # List of category names
    lead_time = models.IntegerField(default=2) # In days
    payment_terms = models.CharField(max_length=100, default='Net 30')
    rating = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    since = models.DateField(auto_now_add=True)
    
    # Performance metrics (could be calculated, but stored for simplicity in this demo)
    on_time_rate = models.IntegerField(default=0)
    quality_score = models.IntegerField(default=0)
    fill_rate = models.IntegerField(default=0)
    avg_response = models.CharField(max_length=50, default='—')

    def __str__(self):
        return self.name

class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('delivered', 'Delivered'),
        ('late', 'Late'),
        ('pending', 'Pending'),
    ]
    
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='purchase_orders')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    code = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    items = models.JSONField(default=list) # List of items in the PO

    def __str__(self):
        return self.code

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('discrepancy', 'Discrepancy'),
    ]
    
    po = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='invoices')
    code = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    received_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    match_status = models.CharField(max_length=100, default='3-WAY MATCH COMPLETE')
    match_results = models.JSONField(default=dict)

    def __str__(self):
        return self.code
