const recoveryPassword = (recoveryCode, yourName) => {
    return `
    <body style="margin: 0; box-sizing: border-box; padding: 0">        
        <section
            style="
            background-color: rgb(63, 176, 172);
            border-radius: 1px solid red;
            color: whitesmoke;
            display: flex;
            flex-direction: column;
            padding: 0 12px;
            text-align: left;
            "
        >
            <h3>Hola ${yourName}!!</h3>
            <p>
                Se ha solicitado un cambio de contraseña para el usuario
                registrado con este email en Balloon Experiences.
            </p>
            <p>El código de recuperación es: ${recoveryCode}</p>
            <p>
                Copia el código de recuperación y pégalo en tu petición de
                reseteo de contraseña
            </p>
            <p>
                Si no has solicitado la recuperación de contraseña, ignora este
                email
            </p>
            <p>Saludos desde Balloon</p>
            <p>Balloon Team</p>
        </section>
    </body>`;
};

module.exports = recoveryPassword;
