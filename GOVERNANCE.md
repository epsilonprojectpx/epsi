# Gobernanza de EPSI

Este documento describe cómo funciona la hermandad: quién decide, cómo se entra, cómo se asciende y cómo se resuelven los problemas.

## 1. Propósito

EPSI es una hermandad de código con sede en Managua, Nicaragua. Reúne a personas que quieren construir, aprender y publicar proyectos en GitHub dentro de un grupo ordenado, con identidad y reglas claras.

## 2. Grados y equipos

Cada grado tiene un equipo en la organización y un nivel de acceso en el repositorio.

| Grado | Equipo | Cómo se llega | Acceso en el repo |
|---|---|---|---|
| I. Buscador | `buscadores` | Ingreso aprobado | Lectura |
| II. Devoto | `devotos` | Un pull request fusionado | Lectura |
| III. Iluminado | `iluminados` | Tres pull requests fusionados | Triage: etiquetar y gestionar solicitudes |
| IV. Hermano-Padre | `hermanos-padre` | Lo concede un Hermano-Padre | Mantenimiento: aprobar, fusionar, decidir |

Los grados I a III se recalculan automáticamente cada semana a partir de los pull requests fusionados. El grado IV es siempre una decisión humana.

## 3. Ingreso

1. La persona abre una [solicitud de ingreso](https://github.com/epsilonprojectpx/epsi/issues/new?template=solicitud.yml) con su propia cuenta de GitHub.
2. Una acción automática valida que el usuario exista y que coincida con quien abre la solicitud.
3. Un Hermano-Padre o un Iluminado revisa la solicitud y, si procede, aplica la etiqueta `aprobado`.
4. La acción asigna número de hermano, genera la insignia y registra a la persona en `data/miembros.json`.
5. La persona acepta la invitación a la organización, hace pública su pertenencia y añade `@epsilonprojectpx` al campo Company de su perfil.

Se procura responder a cada solicitud en un máximo de 7 días. Una solicitud puede rechazarse si incumple el [código de conducta](CODE_OF_CONDUCT.md) o si no pasa la validación.

## 4. Decisiones

- Los cambios al repositorio se proponen mediante pull request.
- Los Hermanos-Padre deciden por consenso. Si no lo hay, decide el fundador.
- Los cambios a este documento, al código de conducta y a la identidad de marca requieren la aprobación de al menos un Hermano-Padre.
- La rama principal está protegida contra borrado y sobrescritura de historial.

## 5. Conducta y sanciones

Las reglas están en el [código de conducta](CODE_OF_CONDUCT.md). Las medidas, de menor a mayor:

1. Aviso privado o comentario público.
2. Suspensión temporal de permisos.
3. Retiro del registro y de la organización.

Cada medida se explica por escrito a la persona afectada.

## 6. Reconocimientos

Kraft recompensa a los hermanos registrados con diplomas de reconocimiento. Cada diploma es un documento imprimible, con número propio, verificable en la web.

| Diploma | Requisito |
|---|---|
| Diploma de las Mil Contribuciones | Más de 1,000 contribuciones en GitHub durante los últimos 365 días |

Las contribuciones se consultan cada semana con la API de GitHub y cuentan las visibles en el perfil de la persona. Un diploma otorgado no se retira. El catálogo está en `data/diplomas.json`.

## 7. Seguridad y datos

El registro público solo guarda el usuario de GitHub, el número, el grado, el área y la fecha. Las vulnerabilidades se reportan según [SECURITY.md](SECURITY.md).

## 8. Cambios

Este documento evoluciona. Cualquier hermano puede proponer cambios con un pull request.
