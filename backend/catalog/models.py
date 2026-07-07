from django.db import models


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='productos')
    nombre = models.CharField(max_length=150)
    slug = models.SlugField(max_length=180, unique=True)
    descripcion = models.TextField(blank=True)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre


class Variante(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='variantes')
    talla = models.CharField(max_length=20, blank=True)
    color = models.CharField(max_length=40, blank=True)
    sku = models.CharField(max_length=50, unique=True)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.producto.nombre} - {self.talla} - {self.color}"


class ImagenProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to='productos/')
    es_principal = models.BooleanField(default=False)

    def __str__(self):
        return f"Imagen de {self.producto.nombre}"
