# epsi

hermandad de github desde managua, nicaragua, inspirada en el programa epsilon de gta v. sitio estático, sin dependencias salvo dos fuentes de google.

![portada](assets/hero.png)

![página completa](assets/pagina.png)

## ver

https://kisnner26.github.io/epsi/

## cómo funciona el registro

1. la persona abre una solicitud con el formulario del sitio (issue público, desde su propia cuenta).
2. una acción valida que el usuario exista y que coincida con quien abre la solicitud.
3. un hermano-padre pone la etiqueta `aprobado`; la acción asigna el número, lo guarda en `data/miembros.json` y cierra la solicitud.
4. el sitio lee ese archivo y muestra el registro.

## local

```bash
python3 -m http.server 8123
```

proyecto de humor, sin relación con rockstar games.
