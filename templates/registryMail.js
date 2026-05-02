const { PUBLIC_HOST } = process.env;

const registryMail = (registryCode) => {
    const validateUrl = `${PUBLIC_HOST}/user/validate/${registryCode}`;

    return `
  <body style="margin:0; padding:0; background-color:#f4f6f8; color:#333; font-family: 'Segoe UI', Arial, sans-serif;">
    <!-- Preheader (hidden in most clients) -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Activa tu cuenta de Balloon con un clic.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">
            
            <!-- Header / Logo -->
            <tr>
              <td align="center" style="background-color:#3fb0ac; padding:24px;">
                <img src="https://imagizer.imageshack.com/img922/9099/Sj6jBW.png" alt="Balloon Experiences" width="56" style="display:block; border:0; outline:none; text-decoration:none; margin:0 auto 8px auto;">
                <h2 style="margin:8px 0 0 0; font-size:20px; line-height:1.2; color:#ffffff;">Activa tu cuenta</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <h3 style="margin:0 0 12px 0; color:#3fb0ac; font-size:18px;">¡Bienvenida/o a Balloon!</h3>
                <p style="margin:0 0 12px 0; line-height:1.6; font-size:15px;">
                  Para completar tu registro, por favor confirma tu dirección de correo electrónico.
                </p>

                <!-- CTA Button -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:24px auto;">
                  <tr>
                    <td align="center" bgcolor="#3fb0ac" style="border-radius:8px;">
                      <a href="${validateUrl}" target="_blank" rel="noopener noreferrer"
                        style="display:inline-block; padding:14px 28px; font-size:16px; line-height:1; color:#ffffff; text-decoration:none; font-weight:600; letter-spacing:0.3px;">
                        Activar cuenta
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Secondary link / Fallback -->
                <p style="margin:0 0 8px 0; line-height:1.6; font-size:14px; color:#555;">
                  Si el botón no funciona, copia y pega este enlace en tu navegador:
                </p>
                <p style="margin:0 0 16px 0; line-height:1.6; font-size:13px; word-break:break-all; color:#777;">
                  <a href="${validateUrl}" target="_blank" rel="noopener noreferrer" style="color:#3fb0ac; text-decoration:underline;">
                    ${validateUrl}
                  </a>
                </p>

                <hr style="border:none; border-top:1px solid #eee; margin:24px 0;">

                <p style="margin:0; line-height:1.6; font-size:13px; color:#666;">
                  Si tú no has creado esta cuenta, puedes ignorar este mensaje con total tranquilidad.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color:#f7f7f7; padding:16px;">
                <p style="margin:0; font-size:12px; color:#888;">
                  © ${new Date().getFullYear()} Balloon Experiences. Todos los derechos reservados.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  `;
};

module.exports = registryMail;
