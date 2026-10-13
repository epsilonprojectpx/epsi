<p align="center">
  <img src="brand/social-preview.png" alt="EPSI, hermandad de Managua, Nicaragua" width="100%">
</p>

# EPSI

Hermandad de código en GitHub, con sede en Managua, Nicaragua. Se entra por solicitud, se crece con contribuciones y se queda en un registro público.

**Sitio web** https://epsilonprojectpx.github.io/epsi/ · **Organización** https://github.com/epsilonprojectpx

![Portada del sitio](assets/hero.png)

## Contenido

| Documento | Para qué sirve |
|---|---|
| [GOVERNANCE.md](GOVERNANCE.md) | Grados, equipos, ingreso, decisiones y sanciones |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Reglas de convivencia |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Cómo contribuir y flujo de trabajo |
| [SECURITY.md](SECURITY.md) | Cómo reportar vulnerabilidades |
| [SUPPORT.md](SUPPORT.md) | Dónde pedir ayuda |
| [brand/](brand/README.md) | Identidad: emblema, paleta, tipografía y voz |

## Unirse

1. Abre la [solicitud de ingreso](https://github.com/epsilonprojectpx/epsi/issues/new?template=solicitud.yml) desde tu cuenta.
2. Una acción valida que el usuario exista y coincida con quien la abre.
3. Un Hermano-Padre o un Iluminado la aprueba con la etiqueta `aprobado`.
4. Recibes tu número, tu insignia y tu lugar en el registro.

## Grados

| Grado | Equipo | Cómo se llega |
|---|---|---|
| I. Buscador | `buscadores` | Ingreso aprobado |
| II. Devoto | `devotos` | Un pull request fusionado |
| III. Iluminado | `iluminados` | Tres pull requests fusionados |
| IV. Hermano-Padre | `hermanos-padre` | Lo concede un Hermano-Padre |

Los grados I a III se recalculan solos cada semana.

## En tu perfil

Todo hermano debe llevar EPSI en su perfil de GitHub:

1. Acepta la invitación a la [organización](https://github.com/epsilonprojectpx).
2. Haz pública tu pertenencia en [People](https://github.com/orgs/epsilonprojectpx/people).
3. Escribe `@epsilonprojectpx` en el campo Company de tu [perfil](https://github.com/settings/profile).

## Estructura del repositorio

```text
index.html, style.css, app.js   sitio web estático
assets/                          imágenes y audio
brand/                           identidad de marca
data/miembros.json               registro de hermanos (lo mantiene la automatización)
badges/                          insignias por miembro (automáticas)
scripts/                         generación de insignias y ascensos
.github/                         formularios, plantillas y flujos de trabajo
```

## Desarrollo local

```bash
python3 -m http.server 8123
```
