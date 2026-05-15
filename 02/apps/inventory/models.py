from django.db import models
import uuid

class Branch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch_code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    name_az = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=50)
    city_az = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField()
    address_az = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=100, blank=True, null=True)
    opening_time = models.TimeField(default='09:00:00')
    closing_time = models.TimeField(default='21:00:00')
    timezone = models.CharField(max_length=50, default='Asia/Baku')
    status = models.CharField(max_length=20, default='active')
    risk_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    fefo_compliance_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    name_az = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    parent_category = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sku = models.CharField(max_length=50, unique=True)
    barcode = models.CharField(max_length=100, unique=True, blank=True, null=True)
    name = models.CharField(max_length=200)
    name_az = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    unit = models.CharField(max_length=20)
    unit_az = models.CharField(max_length=20, blank=True, null=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    min_stock_level = models.IntegerField(default=0)
    max_stock_level = models.IntegerField(default=0)
    reorder_point = models.IntegerField(default=0)
    lead_time_days = models.IntegerField(default=1)
    storage_requirements = models.JSONField(default=dict, blank=True)
    is_perishable = models.BooleanField(default=True)
    shelf_life_days = models.IntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    image_url = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.sku} - {self.name}"

class StockItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    batch_number = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    received_quantity = models.IntegerField(default=0)
    damaged_quantity = models.IntegerField(default=0)
    expiry_date = models.DateField()
    received_date = models.DateField(auto_now_add=True)
    storage_location = models.CharField(max_length=100, blank=True, null=True)
    storage_zone = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['product', 'branch', 'batch_number']

    def __str__(self):
        return f"{self.product.name} - {self.batch_number} - {self.branch.name}"

class Alert(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stock_item = models.ForeignKey(StockItem, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    alert_level = models.CharField(max_length=20)
    quantity_at_risk = models.IntegerField()
    estimated_loss = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_days_left = models.IntegerField()
    ai_recommendation = models.TextField()
    recommended_action = models.CharField(max_length=50)
    confidence_score = models.IntegerField()
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alert: {self.product.name} at {self.branch.name}"

class Transfer(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('received', 'Received'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='outgoing_transfers')
    to_branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='incoming_transfers')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    stock_item = models.ForeignKey(StockItem, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField()
    driver_name = models.CharField(max_length=100, blank=True, null=True)
    eta = models.CharField(max_length=100, blank=True, null=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    received_at = models.DateTimeField(null=True, blank=True)
    received_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transfer: {self.product.name} from {self.from_branch.name} to {self.to_branch.name}"
