import requests
from django.conf import settings
from rest_framework import views, permissions, status
from rest_framework.response import Response
from orders.models import Orden
from .models import Transaccion
from .serializers import CobroCulqiSerializer, TransaccionSerializer


class CobrarOrdenView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CobroCulqiSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        orden_id = serializer.validated_data['orden_id']
        token = serializer.validated_data['token']

        orden = Orden.objects.get(id=orden_id, usuario=request.user)
        monto_centavos = int(orden.total * 100)

        headers = {
            'Authorization': f'Bearer {settings.CULQI_SECRET_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {
            'amount': monto_centavos,
            'currency_code': 'PEN',
            'email': request.user.email,
            'source_id': token,
        }

        response = requests.post(
            'https://api.culqi.com/v2/charges',
            json=payload,
            headers=headers,
        )
        data = response.json()

        if response.status_code == 201:
            transaccion = Transaccion.objects.create(
                orden=orden,
                culqi_charge_id=data.get('id', ''),
                monto=orden.total,
                estado='exitoso',
            )
            orden.estado = 'pagado'
            orden.save()
            return Response(TransaccionSerializer(transaccion).data, status=status.HTTP_201_CREATED)

        Transaccion.objects.create(orden=orden, monto=orden.total, estado='fallido')
        return Response(data, status=status.HTTP_400_BAD_REQUEST)
