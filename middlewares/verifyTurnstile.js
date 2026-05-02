'use strict';

const https = require('https');
const querystring = require('querystring');

const verifyToken = ({ secret, token, ip }) =>
    new Promise((resolve, reject) => {
        const body = querystring.stringify({
            secret,
            response: token,
            remoteip: ip,
        });

        const req = https.request(
            {
                hostname: 'challenges.cloudflare.com',
                path: '/turnstile/v0/siteverify',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(body),
                },
                timeout: 5000,
            },
            (res) => {
                let raw = '';

                res.on('data', (chunk) => {
                    raw += chunk;
                });

                res.on('end', () => {
                    try {
                        resolve(JSON.parse(raw));
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        );

        req.on('timeout', () => {
            req.destroy(new Error('Timeout validando CAPTCHA'));
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });

const verifyTurnstile = async (req, res, next) => {
    try {
        const secret = process.env.TURNSTILE_SECRET_KEY;

        // En desarrollo puede omitirse la clave para no bloquear el registro local.
        if (!secret) return next();

        const token =
            req.body?.turnstileToken ||
            req.body?.captchaToken ||
            req.body?.['cf-turnstile-response'];

        if (!token) {
            return res.status(400).json({
                status: 'error',
                message: 'Verificación CAPTCHA obligatoria',
            });
        }

        const result = await verifyToken({
            secret,
            token,
            ip: req.ip,
        });

        if (!result.success) {
            return res.status(403).json({
                status: 'error',
                message: 'No se pudo verificar el CAPTCHA',
            });
        }

        return next();
    } catch (error) {
        error.httpStatus = 502;
        error.message = 'Error validando CAPTCHA';
        return next(error);
    }
};

module.exports = verifyTurnstile;
