from django.urls import path
from .views import TipoCambioView

urlpatterns = [
    path('tipo-cambio/', TipoCambioView.as_view(), name='tipo_cambio'),
]
