from rest_framework import serializers
from .models import Categoria, Producto, Variante, ImagenProducto


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'slug', 'descripcion']


class VarianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variante
        fields = ['id', 'talla', 'color', 'sku', 'stock']


class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = ['id', 'imagen', 'es_principal']


class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source='categoria', write_only=True
    )
    variantes = VarianteSerializer(many=True, read_only=True)
    imagenes = ImagenProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'descripcion', 'precio_base', 'activo',
            'categoria', 'categoria_id', 'variantes', 'imagenes',
        ]
