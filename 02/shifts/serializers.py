from rest_framework import serializers
from .models import Shift, ShiftRequest
from apps.accounts.serializers import UserSerializer

class ShiftSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.full_name')
    branch_name = serializers.ReadOnlyField(source='branch.name')
    
    class Meta:
        model = Shift
        fields = '__all__'

class ShiftRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.full_name')
    responded_by_name = serializers.ReadOnlyField(source='responded_by.full_name')
    
    class Meta:
        model = ShiftRequest
        fields = '__all__'
