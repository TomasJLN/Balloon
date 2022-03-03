# Balloon Project - Description

```
# FIRST STEPS #
Please, keep an eye on Documentation Folder to get some info
To create database execute './create_db.sh' inside  database folder.
You should create in your mysql the user 'demo' with password '123456'
Then run: 'npm run db', to create all tables
If you have database 'balloon_db' forget this steps, just
Execute: 'npm run db', to create all tables and populateData to get some experiences

#############################################################################

/** User Endpoints **/
- POST [/user] ➡️ Crear cuenta de usuario pendiente de activar por email
- GET [/user/validate/:registryCode] ➡️ Activar cuenta de usuario por código de registro (equivale a la activación desde el link del email).
- DELETE [/user] ➡️ Borra cuenta de usuario. Sólo el propio usuario puede borrar su cuenta por medio de su token
- PUT [/user/password] ➡️ Actualiza contraseña usuario, necesaria la contraseña actual.
- PUT [/user/password/recover] ➡️ Envío de email con codigo recuperación de contraseña al usuario.
- PUT [/user/password/reset] ➡️ Cambio de contraseña en usuario con ese código de reseteo .
- PUT [/user/avatar] ➡️ Añadir o actualizar avatar de usuario.
- GET [/user/] ➡️ Lista los datos del usuario, requiere token.
- POST [/user/login] ➡️ Login de usuario, retorna el token del usuario.
- PUT [/user/edit] ➡️ Edita los datos del usuario logueado, requiere token.

/** Category Endpoints **/
- POST [/category] ➡️ Crear una categoría nueva, 'title' requerido, necesario token administrador
- PUT [/category/:idCategory] ➡️ Editar datos categoría, necesario token administrador
- GET [/category/:idCategory] ➡️ Ver la información de una categoría, implementar autorización para admin sólo
- GET [/category] ➡️ Listar todas las categorías activas. No requiere autorización
- DELETE [/category/:idCategory] ➡️ Eliminar los datos de la entrada de la categoría a [delete] y la desactiva, necesario autorización de administrador. No se elimina la tupla.
- PUT [/category/:idCategory/photo] ➡️ Escribir imagen de categoría en el disco duro y guarda la ruta en la Base de Datos.

/** Experience Endpoints **/
- POST [/experience] ➡️ Crear experiencia nueva, requiere autorización como administrador.
- PUT [experience/:idExperience/photo] ➡️ Escribir imagen de experiencia en disco duro y guarda la ruta de dicha imagen en la Base de Datos.
- DELETE [/experience/:idExperience] ➡️ Elimina los datos de la entrada de la experiencia a [delete] y la desactiva, necesaria autorización de administrador. No se elimina el registro.
- PUT [/experience/:idExperience] ➡️ Actualizar datos de la experiencia, necesaria la autorización como administrador
- GET [/experience/:idExperience] ➡️ Visualizar los datos de una experiencia, necesita autorización de administrador
- GET [/experience/list] ➡️  Visualizar los datos de todas las experiencias, no necesita autorización

/** Booking Endpoints **/
- POST [/booking] ➡️ Crear reserva del usuario logueado. Necesita autorización.
- GET [/booking/list] ➡️ Lista todas reservas activas. Necesita autorización de administrador.
- GET [/booking:idBE] ➡️ Muestra los datos de una reserva. Necesita autorización del usuario que la creó.
- DELETE [/booking/:ticketNumber] ➡️ Cancelar reserva hecha por el usuario. Necesita autorización. Envía mail de cancelación.

/** Review Endpoints **/
- POST [/review/:idBE] ➡️ Crear opinión de una reserva ya disfrutada. Necesita autorización.
- GET [/review] ➡️ Listado de opiniones goblales o puede ir por idExperiencia.

/** Filters Endpoints **/
- GET [/filters] ➡️ Filtros seleccionables a través de query params
- GET [/filters/occupied] ➡️ Filtro de experiencias activas con número de plazas ocupadas.
- GET [/filters/featured] ➡️ Filtro de experiencias activas marcadas como destacadas.

```
