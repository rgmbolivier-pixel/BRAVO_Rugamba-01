from django.db import models
import uuid
from apps.inventory.models import Branch, StockItem

class WasteRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    stock_item = models.ForeignKey(StockItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    reason = models.CharField(max_length=100)
    notes = models.TextField(blank=True, null=True)
    logged_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    logged_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Waste: {self.stock_item.product.name} at {self.branch.name}"
