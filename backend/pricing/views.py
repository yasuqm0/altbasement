import requests
from rest_framework import views, permissions, status
from rest_framework.response import Response


class TipoCambioView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            response = requests.get('https://open.er-api.com/v6/latest/USD', timeout=5)
            data = response.json()
            tasa = data['rates']['PEN']
            return Response({'moneda_base': 'USD', 'moneda_destino': 'PEN', 'tasa': tasa})
        except Exception:
            return Response(
                {'error': 'No se pudo obtener el tipo de cambio'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
