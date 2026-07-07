from django.urls import path
from .views import CobrarOrdenView

urlpatterns = [
    path('cobrar/', CobrarOrdenView.as_view(), name='cobrar'),
]
