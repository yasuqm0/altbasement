from rest_framework import viewsets, permissions
from .models import Orden
from .serializers import OrdenSerializer


class OrdenViewSet(viewsets.ModelViewSet):
    serializer_class = OrdenSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Orden.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
