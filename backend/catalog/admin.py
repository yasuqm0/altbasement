from django.contrib import admin
from .models import Categoria, Producto, Variante, ImagenProducto

admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(Variante)
admin.site.register(ImagenProducto)
