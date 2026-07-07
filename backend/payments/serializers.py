from rest_framework import serializers
from .models import Transaccion


class TransaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaccion
        fields = ['id', 'orden', 'culqi_charge_id', 'monto', 'estado', 'creado_en']
        read_only_fields = ['culqi_charge_id', 'estado', 'creado_en']


class CobroCulqiSerializer(serializers.Serializer):
    orden_id = serializers.IntegerField()
    token = serializers.CharField()
