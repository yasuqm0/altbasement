from catalog.models import Categoria, Producto, Variante
from django.utils.text import slugify

datos = [
    {
        "categoria": "Poleras",
        "descripcion_categoria": "Poleras estampadas",
        "productos": [
            {
                "nombre": "Polera Gothic Rose",
                "descripcion": "Polera negra con estampado gótico",
                "precio_base": "59.90",
                "variantes": [
                    {"talla": "S", "color": "Negro", "sku": "POL-GR-S-NEG", "stock": 10},
                    {"talla": "M", "color": "Negro", "sku": "POL-GR-M-NEG", "stock": 15},
                    {"talla": "L", "color": "Negro", "sku": "POL-GR-L-NEG", "stock": 8},
                ],
            },
            {
                "nombre": "Polera Dark Poetry",
                "descripcion": "Polera con frase de poesía gótica",
                "precio_base": "64.90",
                "variantes": [
                    {"talla": "M", "color": "Vino", "sku": "POL-DP-M-VIN", "stock": 12},
                ],
            },
        ],
    },
    {
        "categoria": "Accesorios",
        "descripcion_categoria": "Accesorios de estilo alternativo",
        "productos": [
            {
                "nombre": "Collar Choker Cruz",
                "descripcion": "Choker de cuero con cruz metálica",
                "precio_base": "29.90",
                "variantes": [
                    {"talla": "", "color": "Negro", "sku": "ACC-CH-NEG", "stock": 20},
                ],
            },
        ],
    },
]

for cat_data in datos:
    categoria, creada = Categoria.objects.get_or_create(
        nombre=cat_data["categoria"],
        defaults={
            "slug": slugify(cat_data["categoria"]),
            "descripcion": cat_data["descripcion_categoria"],
        },
    )
    print(f"Categoria: {categoria.nombre} ({'nueva' if creada else 'ya existía'})")

    for prod_data in cat_data["productos"]:
        producto, creado = Producto.objects.get_or_create(
            nombre=prod_data["nombre"],
            defaults={
                "categoria": categoria,
                "slug": slugify(prod_data["nombre"]),
                "descripcion": prod_data["descripcion"],
                "precio_base": prod_data["precio_base"],
            },
        )
        print(f"  Producto: {producto.nombre} ({'nuevo' if creado else 'ya existía'})")

        for var_data in prod_data["variantes"]:
            variante, creada_v = Variante.objects.get_or_create(
                sku=var_data["sku"],
                defaults={
                    "producto": producto,
                    "talla": var_data["talla"],
                    "color": var_data["color"],
                    "stock": var_data["stock"],
                },
            )
            print(f"    Variante: {variante.sku} ({'nueva' if creada_v else 'ya existía'})")

print("\n¡Listo!")
