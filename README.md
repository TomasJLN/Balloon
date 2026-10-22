# Balloon Experiences

**Balloon Experiences** es una aplicación full-stack académica para demostrar la
exploración y reserva simulada de experiencias, junto con la administración del
catálogo desde un dashboard de solo lectura en su despliegue público.

El proyecto está dividido en dos aplicaciones:

- **Backend**: API REST con Node.js, Express 5 y MySQL, ubicada en `Balloon`.
- **Frontend**: SPA React, ubicada en `../Balloon_Front`, que consume la API.

## Estado actual

- Acceso público mediante cuentas ficticias `@demo.com`, sin registro de usuarios
  ni introducción de datos personales.
- Protección anti-abuso en registro con rate limit por IP, rate limit por email
  y límite máximo de usuarios.
- Login automático con la cuenta ficticia de María López.
- Listado y filtrado de experiencias por texto, categoría, ubicación, precio,
  fechas y destacados.
- Vista de experiencia renovada con imagen, datos clave, precio, disponibilidad,
  checkout, mapa y experiencias relacionadas.
- Reservas simuladas en la sesión e histórico ficticio determinista.
- Visualización de QR demostrativos sin validez comercial ni contractual.
- Mapa de "Cómo llegar" con marcador de globo HTML/CSS.
- Dashboard para roles `admin` y `viewer`, con métricas, gráficos y gestión.
- Tour de demostración interactivo activado desde la landing.
- Página 404/error con efecto CRT retro e interfaz de terminal interactiva.
- Página "Quiénes somos" rediseñada con hero, valores y grid de equipo.
- UI responsive con React, React Router, React Toastify, Leaflet, Recharts y MUI.

## Requisitos

- Node.js 18 o superior
- MySQL 5.7 o superior
- npm

## Estructura

```text
Balloon/
  app.js
  index.js
  controllers/
  database/
  middlewares/
  routes/
  static/uploads/
  validations/

../Balloon_Front/
  public/
  src/
    components/
    contexts/
    hooks/
    pages/
    routes/
    styles/
```

## Puesta en marcha

### Backend

En `Balloon`:

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```

En PowerShell puedes sustituir `cp` por `Copy-Item`:

```powershell
Copy-Item .env.example .env
```

`npm run setup` crea la base de datos, sus tablas, el catálogo inicial y los
datos ficticios. Para regenerar únicamente las cuentas y reservas demo usa:

```bash
npm run seedDemo
```

El backend usa por defecto MySQL con la base `balloon_db`. Revisa `.env.example`
para configurar puerto, credenciales de base de datos y `SECRET` JWT.

Si despliegas detrás de proxy o balanceador, configura `TRUST_PROXY` con el
número de saltos de confianza para que el rate limit detecte bien la IP real.

El registro público tiene un cupo máximo configurable de usuarios normales:

```env
MAX_USER_ACCOUNTS=50
```

El despliegue académico funciona en modo demostración por defecto. En este
modo solo pueden iniciar sesión las cuentas ficticias `@demo.com` y la API
bloquea registros, cambios de perfil, newsletter, reservas y reseñas:

```env
DEMO_MODE=true
```

Establecer `DEMO_MODE=false` reactiva esas escrituras únicamente para un
entorno privado de desarrollo.

Antes de publicar una base de datos que haya aceptado registros reales, puede
eliminarse todo usuario normal que no pertenezca al dominio ficticio
`@demo.com`, junto con sus reservas, QR, reseñas y avatares asociados:

```bash
node database/purgePersonalDataForDemo.js --confirm
```

### Frontend

En `../Balloon_Front`:

```bash
npm install
cp .env_example .env
npm start
```

En PowerShell:

```powershell
Copy-Item .env_example .env
```

Variable principal del frontend:

```env
VITE_BACKEND_URL=http://localhost:4000
```

La SPA se sirve normalmente en `http://localhost:3000`, según la configuración
de Vite incluida en el proyecto.

## Scripts Backend

| Comando | Descripción |
|---|---|
| `npm start` | Arranca la API con Node |
| `npm run dev` | Arranca la API con nodemon |
| `npm run setup` | Crea la base, tablas, catálogo y datos demo |
| `npm run seedDemo` | Carga usuarios, reservas y reseñas demo |
| `npm test` | Ejecuta tests Jest/Supertest |
| `bash scripts/deploy.sh` | Despliega backend y frontend en el servidor (ver abajo) |

## Despliegue

En el servidor, con `Balloon` y `Balloon_Front` en la misma carpeta y el backend
gestionado por PM2 con el nombre `balloon`, ejecuta con el usuario dueño de PM2:

```bash
bash scripts/deploy.sh
```

Hace `git pull` en ambos repositorios y, solo en los que han cambiado:

- **Backend**: `npm ci --omit=dev`, comprueba que cargan los módulos nativos
  (`bcrypt`, `sharp`), `pm2 restart balloon` y espera a que la API responda.
- **Frontend**: `npm ci` y `npm run build`; si la compilación falla restaura el
  build anterior para no dejar la web sin ficheros.

Opciones: `--force` (reinstala y reinicia aunque no haya cambios), `--solo-back`,
`--solo-front`. Variables: `BALLOON_PM2_APP`, `BALLOON_FRONT_DIR`,
`BALLOON_NODE_VERSION`.

## Scripts Frontend

| Comando | Descripción |
|---|---|
| `npm start` | Arranca Vite en desarrollo |
| `npm run dev` | Arranca Vite en desarrollo |
| `npm run build` | Genera build de producción |
| `npm run preview` | Sirve localmente el build de producción |
| `npm test` | Ejecuta tests Vitest del frontend |

## Roles

| Rol | Capacidades |
|---|---|
| `user` | Explorar, simular reservas y consultar histórico y QR ficticios |
| `admin` | Gestión del catálogo solo con `DEMO_MODE=false` en entorno privado |
| `viewer` | Acceso de solo lectura al dashboard; no ve emails ni modifica datos |

El rol `viewer` puede navegar por todas las secciones del dashboard y acceder al
detalle de cada categoría y experiencia, pero todos los campos aparecen
deshabilitados y los controles de modificación están ocultos.

## Tour de demostración

La landing incluye un botón **▶ Demo** que lanza un tour guiado con driver.js:

1. Se muestran 4 pasos sobre la landing (buscador, categorías, experiencias, avatar).
2. Al finalizar el tour se hace login automático como `viewer@demo.com`.
3. El dashboard arranca un segundo tour que recorre los paneles de gestión.

El flag `balloon_demo_continue` en `localStorage` coordina la continuación del
tour entre la landing y el dashboard.

Cuenta demo para el tour y acceso manual:

| Email | Contraseña | Rol |
|---|---|---|
| `viewer@demo.com` | `123456` | `viewer` |

## Registro simplificado

El flujo de alta está intencionadamente simplificado:

1. El usuario completa nombre, apellidos, email, contraseña y acepta términos.
2. El backend crea la cuenta con `active = 1`.
3. La API devuelve directamente un JWT.
4. El frontend guarda el token y redirige a la landing.

No hay paso obligatorio de activación por correo. La ruta histórica
`GET /user/validate/:registryCode` puede existir en el backend, pero el flujo
actual de la interfaz no depende de ella.

Para reducir altas automáticas masivas, el registro aplica:

- Límite por IP: 5 registros por hora.
- Límite por email normalizado: 3 intentos por hora.
- Límite total de cuentas con rol `user`: 50 por defecto mediante
  `MAX_USER_ACCOUNTS`.

## Dashboard y datos demo

El dashboard muestra:

- KPIs de categorías, experiencias, usuarios y facturación mensual.
- Facturación/reservas de los últimos meses.
- Reservas agrupadas por categoría.
- Ranking de experiencias con más reseñas.
- Paneles de gestión para categorías, experiencias y usuarios.

Para poblar datos útiles:

```bash
npm run seedDemo
```

Usuarios demo de tipo `user` generados por el seed:

| Email | Contraseña | Rol |
|---|---|---|
| cualquier `@demo.com` creado por seed | `Demo1234!` | `user` |

## Endpoints principales

Todas las respuestas siguen el patrón general:

```json
{
  "status": "ok",
  "data": {}
}
```

En errores se devuelve `status` de error y `message`.

### Usuarios

| Método y ruta | Descripción | Auth |
|---|---|---|
| `POST /user` | Registro simplificado: crea cuenta activa y devuelve JWT | No |
| `POST /user/login` | Login y devolución de JWT | No |
| `GET /user` | Perfil del usuario autenticado | Sí |
| `PUT /user/edit` | Edita datos del usuario | Sí |
| `PUT /user/avatar` | Actualiza avatar | Sí |
| `PUT /user/password` | Cambia contraseña autenticada | Sí |
| `PUT /user/password/recover` | Envía email con código de recuperación | No |
| `PUT /user/password/reset` | Resetea contraseña con código | No |
| `DELETE /user` | Baja lógica de cuenta | Sí |
| `GET /user/list` | Lista usuarios para dashboard | Sí (`admin`/`viewer`) |
| `PUT /user/toggle/:id` | Activa/desactiva usuario | Sí (`admin`) |

### Categorías

| Método y ruta | Descripción | Auth |
|---|---|---|
| `GET /category` | Lista categorías activas | No |
| `GET /category/:idCategory` | Detalle de categoría | Sí (`admin`/`viewer`) |
| `POST /category` | Crea categoría | Sí (`admin`) |
| `PUT /category/:idCategory` | Edita categoría | Sí (`admin`) |
| `PUT /category/:idCategory/photo` | Sube foto | Sí (`admin`) |
| `DELETE /category/:idCategory` | Desactiva categoría | Sí (`admin`) |

### Experiencias

| Método y ruta | Descripción | Auth |
|---|---|---|
| `GET /experience/list` | Lista experiencias disponibles | No |
| `GET /experience/:idExperience` | Detalle de experiencia | No |
| `POST /experience` | Crea experiencia | Sí (`admin`) |
| `PUT /experience/:idExperience` | Edita experiencia | Sí (`admin`) |
| `PUT /experience/:idExperience/photo` | Sube foto | Sí (`admin`) |
| `DELETE /experience/:idExperience` | Desactiva experiencia | Sí (`admin`) |

### Reservas

| Método y ruta | Descripción | Auth |
|---|---|---|
| `POST /booking` | Crea reserva y genera QR | Sí (`user`) |
| `GET /booking/view` | Reservas del usuario autenticado | Sí |
| `GET /booking/view/:idBooking` | Detalle de reserva por ticket | Sí |
| `GET /booking/view/qr/:idBooking` | QR asociados a una reserva | Sí |
| `GET /booking/list` | Lista reservas para administración | Sí (`admin`) |
| `DELETE /booking/:ticketNumber` | Cancela reserva y elimina QR | Sí |

### Opiniones

| Método y ruta | Descripción | Auth |
|---|---|---|
| `POST /review/:ticketNumber` | Crea valoración sobre una reserva | Sí |
| `GET /review` | Lista reseñas o filtra por experiencia | No |

### Filtros

| Método y ruta | Descripción | Auth |
|---|---|---|
| `GET /filters` | Datos de filtros disponibles | No |
| `GET /filters/occupied` | Plazas ocupadas por experiencia y fecha | No |
| `GET /filters/featured` | Experiencias destacadas | No |
| `GET /allFilter` | Búsqueda combinada de experiencias | No |

### Dashboard

Estos endpoints requieren JWT y rol `admin` o `viewer`. El backend aplica la
misma restricción que el frontend para evitar exponer métricas de administración
si la API queda accesible públicamente.

| Método y ruta | Descripción | Auth |
|---|---|---|
| `GET /dashboard` | Facturación mensual | Sí (`admin`/`viewer`) |
| `GET /dashboard/bestExp` | Top experiencias por reseñas | Sí (`admin`/`viewer`) |
| `GET /dashboard/totalUsers` | Total de usuarios | Sí (`admin`/`viewer`) |
| `GET /dashboard/monthlyRevenue` | Facturación/reservas por mes | Sí (`admin`/`viewer`) |
| `GET /dashboard/bookingsByCategory` | Reservas por categoría | Sí (`admin`/`viewer`) |

## Mejoras recientes de interfaz

- **Tour demo**: botón ▶ Demo en la landing lanza un onboarding guiado con login
  automático y continuación en el dashboard.
- **Dashboard oscuro**: todas las secciones del panel usan fondo `#0f172a` para
  mayor contraste y coherencia visual.
- **Fichas clickeables**: en gestión de categorías y experiencias se puede pulsar
  en cualquier parte de la ficha para acceder al detalle, no solo en el botón.
- **Detalle de solo lectura para viewer**: los formularios de edición deshabilitan
  todos los campos y ocultan el botón de guardar cuando el rol es `viewer`.
- **Botón Volver en edición**: los formularios de categoría y experiencia incluyen
  un botón ← Volver que regresa al listado correspondiente.
- **Página de error CRT**: la pantalla 404 y la página de error tienen efecto de
  monitor CRT (scanlines, viñeta, parpadeo), número `404` con glitch RGB y una
  terminal interactiva con secuencia de boot. Comandos: `home`, `exit`, `cd /` y
  `dashboard` (solo para admin/viewer) navegan de vuelta.
- **Página "Quiénes somos"**: rediseñada con hero degradado, franja de valores con
  tres tarjetas y grid de equipo con foto, rol, skills y enlace a LinkedIn.
- **Limpieza de código muerto**: eliminados 10 archivos sin referencias (componentes
  de acordeón antiguos, hook y helper no usados, imagen duplicada, CSS huérfano).
- Vista de experiencia con layout tipo ficha premium.
- Cards de reservas y experiencias por valorar rediseñadas.
- Página de valoración con imagen, estado, formulario y estrellas alineadas.
- Logo del navbar navega siempre a la landing y cierra menús abiertos.
- Marcador del mapa renovado con globo CSS.

## Notas de seguridad

- La autenticación usa JWT enviado en cabecera `Authorization`.
- El frontend normaliza tokens a formato `Bearer <token>` cuando es necesario.
- Hay rate limit en login, registro y recuperación.
- El registro añade un segundo límite por email y cupo máximo de usuarios.
- `helmet`, `cors`, `compression` y validaciones Joi están integradas en backend.
- El rol `viewer` solo puede leer datos; las rutas de escritura rechazan su token
  con `401` en backend.

## Licencia

Proyecto distribuido bajo licencia ISC.
