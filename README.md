# Balloon Experiences

**Balloon Experiences** es una aplicación full-stack para descubrir experiencias,
reservarlas, consultar códigos QR de entrada, valorar actividades y administrar el
catálogo desde un dashboard.

El proyecto está dividido en dos aplicaciones:

- **Backend**: API REST con Node.js, Express 5 y MySQL, ubicada en `Balloon_RENEW`.
- **Frontend**: SPA React, ubicada en `../Balloon_Front`, que consume la API.

## Estado actual

- Registro de usuario simplificado: `POST /user` crea la cuenta activa y devuelve
  un JWT. El frontend guarda el token y redirige a la landing sin requerir email
  de activación.
- Protección anti-abuso en registro con rate limit por IP, rate limit por email
  y límite máximo de usuarios.
- Login, recuperación y reseteo de contraseña.
- Listado y filtrado de experiencias por texto, categoría, ubicación, precio,
  fechas y destacados.
- Vista de experiencia renovada con imagen, datos clave, precio, disponibilidad,
  checkout, mapa y experiencias relacionadas.
- Reservas con generación de QR por participante.
- Visualización robusta de QR al volver a una reserva.
- Sección de valoración rediseñada y alineada con el estilo visual del site.
- Mapa de "Cómo llegar" con marcador de globo HTML/CSS.
- Dashboard para roles `admin` y `viewer`, con métricas, gráficos y gestión.
- Tour de demostración interactivo activado desde la landing.
- Página 404/error con efecto CRT retro e interfaz de terminal interactiva.
- Página "Quiénes somos" rediseñada con hero, valores y grid de equipo.
- UI responsive con React, React Router, React Toastify, Leaflet, Recharts y MUI.

## Requisitos

- Node.js 14 o superior
- MySQL 5.7 o superior
- npm
- Cuenta o clave de SendGrid para emails de recuperación y notificaciones

## Estructura

```text
Balloon_RENEW/
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

En `Balloon_RENEW`:

```bash
npm install
cp .env.example .env
npm run db
npm run populateData
npm run seedDemo
npm run dev
```

En PowerShell puedes sustituir `cp` por `Copy-Item`:

```powershell
Copy-Item .env.example .env
```

Si necesitas crear la base de datos desde cero, usa también:

```bash
npm run createDB
```

El backend usa por defecto MySQL con la base `balloon_db`. Revisa `.env.example`
para configurar puerto, credenciales de base de datos, `SECRET` JWT y SendGrid.

Si despliegas detrás de proxy o balanceador, configura `TRUST_PROXY` con el
número de saltos de confianza para que el rate limit detecte bien la IP real.

El registro público tiene un cupo máximo configurable de usuarios normales:

```env
MAX_USER_ACCOUNTS=50
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
REACT_APP_BACKEND_URL=http://localhost:4000
```

La SPA se sirve normalmente en `http://localhost:3000`.

## Scripts Backend

| Comando | Descripción |
|---|---|
| `npm start` | Arranca la API con Node |
| `npm run dev` | Arranca la API con nodemon |
| `npm run createDB` | Crea la base de datos |
| `npm run db` | Crea o recrea tablas |
| `npm run populateData` | Carga categorías y experiencias de ejemplo |
| `npm run seedDemo` | Carga usuarios, reservas y reseñas demo |
| `npm test` | Ejecuta tests Jest/Supertest |

## Scripts Frontend

| Comando | Descripción |
|---|---|
| `npm start` | Arranca React en desarrollo |
| `npm run build` | Genera build de producción |
| `npm test` | Ejecuta tests de React |

## Roles

| Rol | Capacidades |
|---|---|
| `user` | Explorar, reservar, ver QR, cancelar reservas y valorar experiencias |
| `admin` | Gestión completa de categorías, experiencias y usuarios |
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

Estos endpoints no aplican middleware de autenticación en backend; el acceso al
dashboard se restringe desde el frontend por rol `admin` o `viewer`.

| Método y ruta | Descripción |
|---|---|
| `GET /dashboard` | Facturación mensual |
| `GET /dashboard/bestExp` | Top experiencias por reseñas |
| `GET /dashboard/totalUsers` | Total de usuarios |
| `GET /dashboard/monthlyRevenue` | Facturación/reservas por mes |
| `GET /dashboard/bookingsByCategory` | Reservas por categoría |

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
