## Configuración del backend

### Instalación de los módulos necesarios de node

1. Nos situamos en la carpeta del proyecto *Balloon*

2. Antes de nada, ejecutamos la instalación de los módulos necesarios de node:
``` npm install ```

### Configurar el archivo .env

3. Debemos crear una copia del archivo *.env.example* y renombrarlo a *.env* en el mismo directorio.
Ahora debemos asignar los valores correctos de nuestra configuración:
   - `MYSQL_USER` / `MYSQL_PASSWORD`: usuario de MySQL con permiso para crear bases de datos
     (por ejemplo el usuario *demo* creado en el documento 01).
   - `MYSQL_DATABASE`: nombre de la base de datos que se creará (por defecto `balloon_db`).
   - `SECRET`: cadena aleatoria larga para firmar los tokens JWT.
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`: credenciales del usuario Administrador de la aplicación.
   - `SENDGRID_API_KEY` / `SENDGRID_FROM`: API de sendgrid y mail autentificado en sendgrid.
   - `DEMO_MODE`: si no se indica, la aplicación arranca en modo demostración (solo cuentas
     `@demo.com` y escrituras bloqueadas). Usar `DEMO_MODE=false` solo en un entorno privado.

### Crear la base de datos, crear las tablas y popular algunos datos de ejemplo
4. Cuando finalice la instalación de los módulos de node, ejecutamos:
``` npm run setup ```

Este único comando crea la base de datos, sus tablas, el usuario administrador, el catálogo
de categorías y experiencias y los datos de demostración (usuarios, reservas y reseñas).
Se puede volver a ejecutar: no duplica la base de datos ni las experiencias existentes.

5. (Opcional) Para regenerar únicamente las cuentas, reservas y reseñas de demostración:
``` npm run seedDemo ```

Cuentas creadas:
   - Admin: el `ADMIN_EMAIL` / `ADMIN_PASSWORD` del *.env*
   - Viewer: `viewer@demo.com` / `123456`
   - Usuarios: cualquier `@demo.com` / `Demo1234!`

6. Arrancamos la API en desarrollo:
``` npm run dev ```

### Importar datos de postman para testeo de los endpoints
1. Dentro de postman debemos importar [File->Import -> Upload Files]

2. Seleccionamos dentro de la carpeta del proyecto el fichero ' Balloon.postman_collection.json' 
