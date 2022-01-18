## Configuración del backend

### Instalación de los módulos necesarios de node

1. Nos situamos en la carpeta del proyecto *balloon*

2. Antes de nada, ejecutamos la instalación de los módulos necesarios de node:
``` npm install ```

### Configurar el archivo .env

3. Debemos crear una copia del archivo *.env.example* y renombrarlo a *.env* en el mismo directorio.
Ahora debemos asignar los valores correctos de nuestra configuración (API de sendgrid, mail autentificado 
en sendgrid, email y contraseña para el usuario Administrador en la aplicación, etc).

### Crear la base de datos, crear las tablas y popular algunos datos de ejemplo
4. Cuando finalice la instalación de los módulos de node, ejecutamos: 
``` npm run createDB ``` - introducir password de mysql para el usuario demo (debe existir tal usuario)

5. Ahora ejecutamos en el terminal: 
``` npm run db ```

6. Por último introducimos unos datos de ejemplo:
``` npm run populateData ```

### Importar datos de postman para testeo de los endpoints
1. Dentro de postman debemos importar [File->Import -> Upload Files]

2. Seleccionamos dentro de la carpeta del proyecto el fichero ' Balloon.postman_collection.json' 
