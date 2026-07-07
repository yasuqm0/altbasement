import uuid
from rest_framework import views, permissions, status
from rest_framework.response import Response
from orders.models import Orden
from .models import Transaccion
from .serializers import CobroCulqiSerializer, TransaccionSerializer


class CobrarOrdenView(views.APIView):
    """
    Pago SIMULADO: no se llama a ninguna pasarela real.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CobroCulqiSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        orden_id = serializer.validated_data['orden_id']
        orden = Orden.objects.get(id=orden_id, usuario=request.user)

        transaccion, _ = Transaccion.objects.update_or_create(
            orden=orden,
            defaults={
                'culqi_charge_id': f'sim_{uuid.uuid4().hex[:16]}',
                'monto': orden.total,
                'estado': 'exitoso',
            }
        )

        orden.estado = 'pagado'
        orden.save()

        return Response(TransaccionSerializer(transaccion).data, status=status.HTTP_201_CREATED)
