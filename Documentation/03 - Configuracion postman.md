## Configuración del postman para peticiones

Con el servidor iniciado. Carpeta pricnipal del backend
`npm run dev `

############################################################################################
Usuarios
############################################################################################

### Crear un nuevo usuario

Usuarios -> Crear Usuario
[POST] http://localhost:4000/user
[Headers]
No requiere token de autorización.
[Body] raw - JSON
Modificar los datos de la pestaña _Body_ para poder crer un usuario.
Todos los campos son obligatorios.
Revisar email, ojo por si está en spam, pulsar en la _imagen_ para activar la cuenta.

### Login de usuario

Usuarios -> Login usuario
[POST] http://localhost:4000/user/login
[Headers]
No requiere token de autorización.
[Body] raw - JSON
Necesario para conseguir el token del usuario. Cumplimentar los campos 'email' y 'password'
Si son correctos, nos devuelve el valor del token del usuario que podemos
almacenarlo en una variable de postman para usar en las posteriores peticiones.

### Cambiar contraseña de usuario

Usuarios -> Cambiar Password Usuario
[PUT] http://localhost:4000/user/password
[Headers]
Authorization -> tokenUsuario. Se permite modificar la contraseña en el usuario con dicho
token.
[Body] raw - JSON
Introducir la contraseña actual en variable _oldPassword_
Introducir nueva contraseña en variable _newPassword_

### Actualizar Avatar de usuario

Usuarios -> Cambiar Foto Perfil Usuario
[PUT] http://localhost:4000/user/avatar
[Headers]
Authorization -> tokenUsuario. Se permite crear/modificar el avatar en el usuario con dicho
token.
[Body] form-data, KEY -> avatar
Se envía como form-data, KEY debe ser de tipo 'file', 'Select Files' seleccionar la foto.

### Actualizar Datos del usuario

Usuarios -> Editar Datos Usuario
[PUT] http://localhost:4000/user/edit
[Headers]
Authorization -> tokenUsuario. Permite modificar los datos del usuario con dicho token.
[Body] raw - JSON
Cumplimentar los datos a actualizar, se puede enviar name, surname y password (password
requiere de un segundo campo llamado newPassword para poder actualizar la contraseña).
Se puede enviar uno o más campos a actualizar.
La contraseña debe concordar con la que hay en la base de datos antes de poder actualizarla.

### Visualizar Perfil del usuario

Usuarios -> Ver Perfil Usuario
[GET] http://localhost:4000/user/
[Headers]
Authorization -> tokenUsuario. Permite ver el perfil del usuario con dicho token.
[Body]
No requiere Body ninguno.
Visualiza todos los datos del usuario, sólo el propio usuario puede visualizar su perfil.

### Recuperar contraseña olvidada

Usuarios -> Recuperar Password Olvidada
[PUT] http://localhost:4000/user/password/recover
[Headers]
No requiere token de autentificación, se manda directamente un email al usuario de ese correo electrónico.
Es necesario que el 'email' figure en la base de datos, sino da error de 'usuario no existe'.
[Body] raw - JSON
"email en el body es obligatorio de cumplimentar"
Introducir email del usuario para recuperar contraseña, se le envía un email con un código de recuperación
que debe copiar y utilizar en la sección _Resetear Password por RecoveryCode_

### Resetear Password por RecoveryCode

Usuarios -> Recuperar Password por RecoveryCode Olvidada
[PUT] http://localhost:4000/user/password/reset
'recoveryCode', 'newPassword' son campos obligatorios a completar.
[Headers]
No requiere token de autentificación, se comprueba directamente en la base de datos si existe algún
_Código de Recuperación_ igual al RecoveryCode.
[Body] raw - JSON
Introducir el _Código de Recuperación_ enviado al email del usuario, también es obligatorio introducir la nueva
contraseña.
Si el _Código de recuperación_ existe en la base de datos, actualizará la contraseña para ese usuario con ese
_Código de Recuperación_

### Verificar Email

Usuarios -> Verificar Email
[GET] http://localhost:4000/user/validate/_codigoderecuperacion_
[Headers]
No requiere token de autentificación
[Body]
No requiere body ninguno.

############################################################################################
Categorías
############################################################################################

### Crear una nueva categoría

Categorías -> Añadir Categoría
[POST] http://localhost:4000/category
[Headers]
Requiere autentificación de*Administrador*
[Body] raw - JSON
Introducir el 'title' (obligatorio) y 'description' (opcional)
Modificar los datos de la pestaña _body_ para poder crear una nueva categoría. El 'title' de la categoría no puede existir
en la base de datos. Sólo el administrador puede crear categorías

### Editar una categoría

Categorías -> Editar Categoría
[PUT] http://localhost:4000/category/_idCategory_
[Headers]
Requiere autentificación de _Administrador_
[Body] raw - JSON
Introducir uno o más campos: 'title', 'description', 'active'

### Ver datos de una categoría

Categorías -> Ver Categoría
[GET] http://localhost:4000/category/_idCategory_
Permite mostrar todos los datos de una categoría. Sólo el _Administrador_ puede acceder a estos datos.
Se puede visualizar categorías desactivadas.
[Headers]
Requiere autentificación de _Administrador_
[Body]
No tiene

### Listar categorías

Categorías -> Listar Categorías
[GET] http://localhost:4000/category
Lista todas las categorías 'activas' existentes. Si no existe ninguna categoría a listar, envía error.
[Headers]
No requiere ningún tipo de autentificación
[Body]
No tiene

### Borrar una categoría

Categorías -> Borrar Categoría
[DELETE] http://localhost:4000/category/_idCategory_
Elimina (anonimiza y desactiva) la categoría con id del path-param. Rellena los campos con 'deleted'
menos el title que al ser único lo rellena con la id de la categoría. En caso de estar previamente desactivada
lanza un error
[Headers]
Requiere autentificación de _Administrador_
[Body]
No tiene

### Actualizar foto categoría

Categorías -> Subir Foto Categoría
[GET] http://localhost:4000/category/_idCategory_/photo
Sube una foto y la asocia a la categoría dentro de la base de datos
[Headers]
Requiere autentificación de _Administrador_
[Body] form-data - KEY photo
Key -> photo
Se envía como form-data, key debe ser de tipo 'file', 'Select Files' seleccionar la foto.
Si el token corresponde a un administrador responde con mensaje de ok.

############################################################################################
Experiencias
############################################################################################

### Crear nueva experiencia

Experiencias -> Crear Experiencia
[POST] http://localhost:4000/experience
[Headers]
Requiere autentificación de _Administrador_
[Body] raw - JSON
Key (Obligatorias) -> idCategory, title, price, location, startDate, endDate, totalPlaces.
Key (Opcionales) -> description, coords, active (default true), featured (default false), conditions, normatives.
Cumplimentar los datos necesarios para crear una nueva experiencia

### Editar experiencia

Experiencias -> Editar Experiencia
[PUT] http://localhost:4000/experience/_idExperience_
[Headers]
Requiere autentificación de _Administrador_
[Body] raw - JSON
Key -> idCategory, title, description, price, location, coords, startDate, endDate, active, featured, totalPlaces, conditions, normatives.
Se puede modificar una o varios valores. El id de Categoría debe existir sino lanza error.

### Borrar experiencia

Experiencias -> Borrar Experiencia
[DELETE] http://localhost:4000/experience/_idExperience_
Elimina (anonimiza y desactiva) la experiencia con id del path-param. Rellena los campos con 'deleted'. En caso de estar previamente
desactivada lanza un error.
[Headers]
Requiere autentificación de _Administrador_
[Body]
No tiene

### Subir foto experiencia

Experiencias -> Subir Foto Experiencia
[PUT] http://localhost:4000/experience/_idExperience_/photo
[Headers]
Requiere autentificación de _Administrador_
[Body] form-data - KEY photo
Key -> photo
Se envía como form-data, key debe ser de tipo 'file', 'Select Files' seleccionar la foto.
Si el token corresponde a un administrador responde con mensaje de ok.

### Ver datos de una experiencia

Experiencias -> Ver Experiencia
[GET] http://localhost:4000/experience/_idExperience_
Muestra todos los datos sobre el id de la experiencia requerida como path-param
[Headers]
Requiere autentificación de*Administrador*
[Body]
No tiene

### Listar experiencias

Experiencias -> Listar Experiencias
[GET] http://localhost:4000/experience/list
Muestra los datos de todas las experiencias activas en la base de datos ordenadas
por título de forma ascendente
[Headers]
No requiere ningún tipo de autentificación
[Body]
No tiene

############################################################################################
Reservas
############################################################################################

### Crear nueva reserva

Reservas -> Crear Reserva
[POST] http://localhost:4000/booking
[Headers]
Requiere autentificación de _usuario_ que crea la reserva
[Body] raw - JSON
Key (Obligatorias) -> dateExperience para la fecha de la reserva, quantity para el numero de plazas de la reserva,
idExperience para la experiencia a reservar.
Comprueba que existen plazas suficientes para la reserva en esa experiencia en ese día en concreto para poder
realizar la reserva, en caso contrario lanza error indicando el número de plazas disponibles.
Se envía mail con los datos de la reserva y QRs de acceso como entradas de la reserva.

### Cancelar reserva

Reservas -> Cancelar Reserva
[DELETE] http://localhost:4000/booking/_booking.ticket_
Se cancela la reserva con el campo ticket igual al introducido como path-param. El usuario tiene que ser el propietario de la
reserva. Se envía mail confirmando la cancelación de la reserva. Se elimina el/los QRs del disco duro y de la
base de datos. No se permite cancelar ninguna reserva pasada o con menos de 24h de antelación.
[Headers]
Requiere autentificación de _usuario_ que creó la reserva
[Body]
No tiene

### Ver una/s reserva/s del usuario

Reservas -> Ver Reserva
[GET] http://localhost:4000/booking/view/_ticketBooking_ || http://localhost:4000/booking/view/
Visualiza los datos relevantes de una reserva por path-param _ticketBooking_, en caso de no enviar el ticket del booking
se muestran todas las reservas de dicho usuario.
Sólo el usuario propietario puede visualizarla/s.
[Headers]
Requiere autentificación de _usuario_ propietario de la reserva
[Body]
No tiene

### Listar reservas

Reservas -> Listar Reservas
[GET] http://localhost:4000/booking/list
Listado de todas las reservas realizadas. Sólo el administrador puede visualizarlas. Ordenadas por fecha de reserva
en orden descendente.
[Headers]
Requiere autentificación de _Administrador_
[Body]
No tiene

############################################################################################
Opiniones
############################################################################################

### Crear nueva opinión

Opiniones -> Crear Opinión
[POST] http://localhost:4000/review/_ticketNumber_
Crea una opinión según _ticketNumber_ (booking). Sólo puede existir una opinión por _ticketNumber_ de 'booking',
la opinión sólo se puede realizar una vez pasada la fecha de la reserva. La opinión no se puede borrar ni modificar.
[Headers]
Requiere autentificación de usuario propietario de la reserva
[Body]
Key -> 'description' la opinión del usuario, 'score' valor entero entre 0 y 5 que es la puntuación que le otorga el usuario a su
experiencia.
Comprueba que la fecha en el momento de la opinión es posterior a la fecha efectiva de la reserva, sino es así,
lanza un error.

### Listar Opiniones

Opiniones -> Listar Opiniones
[GET] http://localhost:4000/review?searchBy=_idExperience_
Listado de opiniones sobre una reserva buscada por su id como query-param, se puede ordenar por campos los resultados
[Headers]
No requiere ningún tipo de autentificación
[Body]
No tiene
[query-params]
'searchByExp' (Opcional) busca la experiencia por su id, si no se envía ningún dato con este valor con los query-params,
lista todas las opiniones
'order' (Opcional) ordena los resultados por alguno de sus campos (Experiencia, Puntuacion, Fecha, Usuario, Categoria)
por defecto por Fecha
'direction' (Opcional) ordena los resultados de forma ascendente o descendente, por defecto,si no se envía este valor
se ordenan de forma ascendente.

############################################################################################
Filtros
############################################################################################

### Filtar Experiencias

Filters -> Filtrar Experiencias según query-params enviados
[GET] http://localhost:4000/allFilter?location=xx&start_price=xx&end_price=xx&start=xx
&end=xx&experience=xx&category=xx&order=price&direction=DESC
Listado de las experiencias válidas según los query-params enviados
[Headers]
No requiere ningún tipo de autentificación
[Body]
No tiene
[query-params]
Todos son opcionales, si no se envía ningún query-param lista todas las experiencias
KEY location -> Muestra las experiencias que tengan en la localización los caracteres
enviados.
KEY start_price -> Precio más bajo para las experiencias.
KEY end_price -> Precio más alto para las experiencias.
KEY start -> Fecha inicial del rango de fechas seleccionadas. Sólo muestra las experiencias
que tengan como fecha fin una fecha posterior a la fecha inicial. Si no se envía fecha incial
se toma el día de la consulta.
KEY end -> Fecha final de la experiencia, la fecha fin de la experiencia debe ser igual o
posterior a la fecha fin marcada por el usuario.
KEY experience -> Muestra las experiencias que tengan en el título o en la descripción los
caracteres enviados.
KEY category -> Muestra las experiencias que pertenezcan a la categoría con los caracteres
enviados.
KEY order -> category|experience|price|location|title . Ordena por columna.
KEY direction -> ASC | DESC. Ordena ascendente o descendentemente.

### Filtar Experiencias con reservas y número de plazas ocupadas

Filtros -> Filtrar Experiencias con Reservas y número de plazas ocupadas
[GET] http://localhost:4000/filters/occupied?experienceID=xx&date=xxxx-xx-xx&order=xx&direction=xx
Listado de las experiencias con reservas activas mostrando el número de plazas ocupadas.
Si no se manda _experienceID_ lista todas las experiencias de ese día, si tampoco se manda _date_
muestra todas las experiencias con plazas ocupadas de todas las experiencias
[Headers]
No requiere ningún tipo de autentificación
[Body]
No tiene
[query-params]
Todos son opcionales
KEY experienceID -> Lista las experiencias por día con plazas ocupadas de la experiencia en cuestión.
KEY date -> Lista todas las experiencias con plazas ocupadas en esa fecha.
KEY order -> category|title|occupied|location. Ordena por columna.
KEY direction -> ASC | DESC. Ordena ascendente o descendentemente.

### Filtar Experiencias por Localización

Filtros -> Filtrar Experiencia por Localización
[GET] http://localhost:4000/filters/review?searchBy=_start_&_order_&_direction_
Listado de las experiencias que contienen la palabra almacenada en el query-param*start* en la localización y estén activas.
[Headers]
No requiere ningún tipo de autentificación
[Body]
No tiene
[query-params]
Todos son opcionales
KEY order -> price|location|title. Ordena por columna, si se deja vacío ordena por título de la categoría.
KEY direction -> ASC | DESC. Ordena ascendente o descendentemente.
