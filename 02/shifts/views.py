from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Shift, ShiftRequest
from .serializers import ShiftSerializer, ShiftRequestSerializer
from django.utils import timezone

class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Shift.objects.all().order_by('-start_time')
        elif user.role == 'manager':
            return Shift.objects.filter(branch=user.branch).order_by('-start_time')
        return Shift.objects.filter(user=user).order_by('-start_time')

    @action(detail=False, methods=['post'])
    def clock_in(self, request):
        user = request.user
        # Check if already clocked in
        active_shift = Shift.objects.filter(user=user, status='active').first()
        if active_shift:
            return Response({"error": "Already clocked in", "shift_id": active_shift.id}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.branch:
            return Response({"error": "User has no assigned branch"}, status=status.HTTP_400_BAD_REQUEST)

        shift = Shift.objects.create(
            user=user,
            branch=user.branch,
            start_time=timezone.now(),
            status='active'
        )
        return Response(ShiftSerializer(shift).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def clock_out(self, request):
        user = request.user
        active_shift = Shift.objects.filter(user=user, status='active').first()
        if not active_shift:
            return Response({"error": "No active shift found"}, status=status.HTTP_400_BAD_REQUEST)
        
        active_shift.end_time = timezone.now()
        active_shift.status = 'completed'
        active_shift.notes = request.data.get('notes', '')
        active_shift.save()
        return Response(ShiftSerializer(active_shift).data)

    @action(detail=False, methods=['get'])
    def current(self, request):
        active_shift = Shift.objects.filter(user=request.user, status='active').first()
        if not active_shift:
            return Response({"active": False})
        return Response({
            "active": True,
            "shift": ShiftSerializer(active_shift).data
        })

class ShiftRequestViewSet(viewsets.ModelViewSet):
    queryset = ShiftRequest.objects.all()
    serializer_class = ShiftRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return ShiftRequest.objects.all().order_by('-created_at')
        elif user.role == 'manager':
            return ShiftRequest.objects.filter(user__branch=user.branch).order_by('-created_at')
        return ShiftRequest.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        active_shift = Shift.objects.filter(user=self.request.user, status='active').first()
        serializer.save(user=self.request.user, shift=active_shift)
