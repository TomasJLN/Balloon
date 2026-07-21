'use strict';

const request = require('supertest');
const app = require('../app');
const {
    demoAccountOnly,
    demoWriteDisabled,
} = require('../middlewares/demoMode');

const createResponse = () => {
    const response = {};
    response.status = jest.fn(() => response);
    response.send = jest.fn(() => response);
    return response;
};

describe('Modo demo', () => {
    const previousDemoMode = process.env.DEMO_MODE;

    beforeEach(() => {
        process.env.DEMO_MODE = 'true';
    });

    afterAll(() => {
        process.env.DEMO_MODE = previousDemoMode;
    });

    test('solo permite iniciar sesión con cuentas ficticias @demo.com', () => {
        const response = createResponse();
        const next = jest.fn();

        demoAccountOnly(
            { body: { email: 'persona@example.com' } },
            response,
            next,
        );

        expect(response.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    test('permite el acceso de una cuenta ficticia', () => {
        const response = createResponse();
        const next = jest.fn();

        demoAccountOnly(
            { body: { email: 'maria.lopez@demo.com' } },
            response,
            next,
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(response.status).not.toHaveBeenCalled();
    });

    test('bloquea operaciones de escritura', () => {
        const response = createResponse();
        const next = jest.fn();

        demoWriteDisabled({}, response, next);

        expect(response.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    test('permite iniciar sesión con la cuenta pública de María', async () => {
        const response = await request(app).post('/user/login').send({
            email: 'maria.lopez@demo.com',
            password: 'Demo1234!',
        });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(typeof response.body.data).toBe('string');
    });

    test('rechaza por HTTP el login de una cuenta no demostrativa', async () => {
        const response = await request(app).post('/user/login').send({
            email: 'persona@example.com',
            password: 'Password123!',
        });

        expect(response.status).toBe(403);
        expect(response.body.status).toBe('error');
    });

    test.each([
        ['post', '/user'],
        ['put', '/user/edit'],
        ['post', '/booking'],
        ['delete', '/booking/DEMO-MARIA-01'],
        ['post', '/review/DEMO-MARIA-01'],
        ['post', '/newsletter'],
        ['put', '/category/1'],
        ['put', '/experience/1'],
    ])('bloquea por HTTP %s %s', async (method, path) => {
        const response = await request(app)[method](path).send({});

        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Función deshabilitada en la demostración académica',
        });
    });

    test('mantiene disponibles las consultas públicas', async () => {
        const response = await request(app).get('/category');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });

    test('rechaza un token de sesión inválido', async () => {
        const response = await request(app)
            .get('/user')
            .set('Authorization', 'Bearer token-demo-caducado');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe('error');
    });
});
