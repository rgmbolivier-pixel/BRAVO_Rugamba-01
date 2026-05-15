from rest_framework import serializers, viewsets, permissions
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.email')
    created_by_name = serializers.ReadOnlyField(source='created_by.email')
    branch_name = serializers.ReadOnlyField(source='branch.name')
    
    class Meta:
        model = Task
        fields = '__all__'

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.all()
        if user.role != 'admin':
            queryset = queryset.filter(branch=user.branch)
            
        assigned_to = self.request.query_params.get('assigned_to')
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)
            
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
