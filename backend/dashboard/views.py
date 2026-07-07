from django.db.models import Sum, Count
from rest_framework import views, permissions
from rest_framework.response import Response
from orders.models import Orden
from catalog.models import Producto


class ResumenView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_ventas = Orden.objects.filter(estado='pagado').aggregate(total=Sum('total'))['total'] or 0
        ordenes_pendientes = Orden.objects.filter(estado='pendiente').count()
        ordenes_pagadas = Orden.objects.filter(estado='pagado').count()
        total_productos = Producto.objects.filter(activo=True).count()

        return Response({
            'total_ventas': total_ventas,
            'ordenes_pendientes': ordenes_pendientes,
            'ordenes_pagadas': ordenes_pagadas,
            'total_productos': total_productos,
        })
