from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    branch_name = serializers.ReadOnlyField(source='branch.name')
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'phone', 'branch', 'branch_name', 'status', 'last_login']
        read_only_fields = ['last_login']

    def create(self, validated_data):
        password = validated_data.pop('password', 'BravoOS@2024!')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
