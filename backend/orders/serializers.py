from rest_framework import serializers
from .models import Orden, ItemOrden


class ItemOrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemOrden
        fields = ['id', 'variante', 'cantidad', 'precio_unitario']


class OrdenSerializer(serializers.ModelSerializer):
    items = ItemOrdenSerializer(many=True, read_only=True)

    class Meta:
        model = Orden
        fields = ['id', 'estado', 'total', 'creado_en', 'items']
        read_only_fields = ['usuario', 'total', 'creado_en']
