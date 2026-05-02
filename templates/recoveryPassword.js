const recoveryPassword = (recoveryCode, yourName) => {
    return `
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; color: #333;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f8; padding: 40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background-color: #3fb0ac; padding: 24px;">
                <h2 style="color: #fff; margin: 0; font-size: 22px;">🔐 Recuperación de contraseña</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 32px;">
                <h3 style="margin-top: 0; color: #3fb0ac;">Hola ${yourName} 👋</h3>
                <p style="line-height: 1.6; font-size: 15px;">
                  Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>Balloon Experiences</strong>.
                </p>
                <p style="line-height: 1.6; font-size: 15px;">
                  Tu código de recuperación es:
                </p>

                <div style="text-align: center; margin: 24px 0;">
                  <span style="
                    display: inline-block;
                    background-color: #3fb0ac;
                    color: #ffffff;
                    font-size: 24px;
                    letter-spacing: 3px;
                    font-weight: bold;
                    padding: 14px 28px;
                    border-radius: 8px;
                  ">
                    ${recoveryCode}
                  </span>
                </div>

                <p style="line-height: 1.6; font-size: 15px;">
                  Copia este código y pégalo en el formulario de recuperación para continuar con el proceso de restablecimiento de tu contraseña.
                </p>
                <p style="line-height: 1.6; font-size: 15px;">
                  Si tú no has solicitado esta recuperación, puedes ignorar este correo con total seguridad.
                </p>
                
                <p style="margin-top: 32px; font-size: 15px;">Un cordial saludo,</p>
                <p style="font-weight: bold; color: #3fb0ac; margin-top: 4px;">El equipo de Balloon 🎈</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color: #f1f1f1; padding: 16px;">
                <p style="margin: 0; font-size: 12px; color: #777;">
                  © ${new Date().getFullYear()} Balloon Experiences. Todos los derechos reservados.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>`;
};

module.exports = recoveryPassword;
