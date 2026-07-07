from django.db import models
from orders.models import Orden


class Transaccion(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('exitoso', 'Exitoso'),
        ('fallido', 'Fallido'),
    ]
    orden = models.OneToOneField(Orden, on_delete=models.CASCADE, related_name='transaccion')
    culqi_charge_id = models.CharField(max_length=100, blank=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaccion #{self.id} - {self.estado}"
