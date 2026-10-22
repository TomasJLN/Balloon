## Pasos previos para la ejecución de la demo

### Pasos para la instalación de MySQL en Ubuntu:

1. sudo apt-get install mysql-server

2. Establecer configuración de seguridad inicial de _MySQL_ para la demo
   (En caso de no tener _MySQL_ instalado

```sudo mysql_secure_installation
   - Would you like to setup VALIDATE PASSWORD plugin?
     Press y|Y for Yes, any other key for No: n
   - Please set the password for root here.
     New password: (contraseña para root)
     Re-enter new password: (contraseña para root)
   - Remove anonymous users: y
     Disallow root login remotely: y
     Remove test database and access to it: y
     Reload privilege tables now: y
```

3. Permisos de acceso para root
   `sudo mysql -u root -p`
   Introducir password de root
   Se nos abre un una _consola de MySQL_ . Permisos para usuario root

```ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    exit;
```

4. Crear el usuario 'demo' para _MySQL_
   `mysql -u root -p` -> introducimos contraseña para root

```CREATE USER 'demo'@'localhost' IDENTIFIED BY 'password'; -> 'password' -> contraseña para el usuario demo
    GRANT ALL PRIVILEGES ON *.* TO 'demo'@'localhost';
    FLUSH PRIVILEGES;
    exit;
```

### Pasos para la instalación de NodeJS en Ubuntu:

El backend necesita Node.js 20.9 o superior (recomendado 24). La versión de `apt`
en Ubuntu suele ser más antigua, así que se instala con _nvm_:

1. `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`

2. Cerrar y volver a abrir la terminal (o `source ~/.bashrc`)

3. `nvm install 24`

4. Comprobar la versión: `node -v`

### Pasos para la configuración de la api de sendgrid:

1. Crear cuenta en `https://sendgrid.com/`

2. En Menu -> Settings -> Sender Authentication -> Verify a Single Sender

3. En Menu -> API Keys -> Create API Key -> Full Access

4. Copiar el código de la API Key generada y pegarla en el fichero _.env_ del proyecto,
   como valor de 'SENDGRID_API_KEY'
5. En el mismo fichero _.env_ del proyecto, asignar el valor del correo que fue
   verificado en el paso 2 'Verify a Single Sender'
