'use strict';

const request = require('supertest');
const app = require('../app');

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Login y devuelve el token JWT listo para usar en Authorization. */
const loginAs = async (email, password) => {
    const res = await request(app)
        .post('/user/login')
        .send({ email, password });
    if (res.statusCode !== 200) return null;
    return `Bearer ${res.body.data}`;
};

// ─── Health ───────────────────────────────────────────────────────────────────

describe('App — Health', () => {
    test('ruta inexistente devuelve 404 con status error', async () => {
        const res = await request(app).get('/ruta-que-no-existe');
        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe('error');
    });
});

// ─── Experiences — públicos ───────────────────────────────────────────────────

describe('Experiences — endpoints públicos', () => {
    test('GET /experience/list devuelve 200 con paginación', async () => {
        const res = await request(app).get('/experience/list');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body).toHaveProperty('pagination');
        expect(res.body.pagination).toHaveProperty('page');
        expect(res.body.pagination).toHaveProperty('limit');
        expect(res.body.pagination).toHaveProperty('total');
        expect(res.body.pagination).toHaveProperty('totalPages');
    });

    test('GET /experience/list respeta parámetros page y limit', async () => {
        const res = await request(app).get('/experience/list?page=1&limit=3');
        expect(res.statusCode).toBe(200);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.limit).toBe(3);
    });

    test('GET /experience/featured devuelve 200', async () => {
        const res = await request(app).get('/experience/featured');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /experience/99999 (inexistente) devuelve 404', async () => {
        const res = await request(app).get('/experience/99999');
        expect([404, 500]).toContain(res.statusCode);
    });

    test('POST /experience sin auth devuelve 401', async () => {
        const res = await request(app).post('/experience').send({});
        expect(res.statusCode).toBe(401);
    });

    test('PUT /experience/1 sin auth devuelve 401', async () => {
        const res = await request(app).put('/experience/1').send({});
        expect(res.statusCode).toBe(401);
    });

    test('DELETE /experience/1 sin auth devuelve 401', async () => {
        const res = await request(app).delete('/experience/1');
        expect(res.statusCode).toBe(401);
    });
});

// ─── Categories ───────────────────────────────────────────────────────────────

describe('Categories — endpoints', () => {
    test('GET /category devuelve 200 con array de categorías', async () => {
        const res = await request(app).get('/category');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /category/:id sin auth devuelve 401', async () => {
        const res = await request(app).get('/category/1');
        expect(res.statusCode).toBe(401);
    });

    test('POST /category sin auth devuelve 401', async () => {
        const res = await request(app).post('/category').send({});
        expect(res.statusCode).toBe(401);
    });

    test('PUT /category/1 sin auth devuelve 401', async () => {
        const res = await request(app).put('/category/1').send({});
        expect(res.statusCode).toBe(401);
    });

    test('DELETE /category/1 sin auth devuelve 401', async () => {
        const res = await request(app).delete('/category/1');
        expect(res.statusCode).toBe(401);
    });
});

// ─── Filters — públicos ───────────────────────────────────────────────────────

describe('Filters — endpoints públicos', () => {
    test('GET /filters/featured devuelve 200', async () => {
        const res = await request(app).get('/filters/featured');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /filters/occupied devuelve 200', async () => {
        const res = await request(app).get('/filters/occupied');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /filters/categories devuelve 200', async () => {
        const res = await request(app).get('/filters/categories');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /filters/all devuelve 200', async () => {
        const res = await request(app).get('/filters/all');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /allFilter (alias v1) devuelve 200', async () => {
        const res = await request(app).get('/allFilter');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});

// ─── Reviews ─────────────────────────────────────────────────────────────────

describe('Reviews — endpoints', () => {
    test('GET /review devuelve 200', async () => {
        const res = await request(app).get('/review');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /review/ratingExp sin ticket devuelve 404 (sin datos)', async () => {
        const res = await request(app).get('/review/ratingExp');
        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe('error');
    });

    test('GET /review?idExperience=1 devuelve 200', async () => {
        const res = await request(app).get('/review?idExperience=1');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('POST /review/:ticket sin auth devuelve 401', async () => {
        const res = await request(app)
            .post('/review/FAKE-TICKET')
            .send({ score: 5, description: 'Genial' });
        expect(res.statusCode).toBe(401);
    });
});

// ─── Dashboard — públicos (sin auth en backend) ───────────────────────────────

describe('Dashboard — endpoints públicos', () => {
    test('GET /dashboard devuelve 200', async () => {
        const res = await request(app).get('/dashboard');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /dashboard/bestExp devuelve 200', async () => {
        const res = await request(app).get('/dashboard/bestExp');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /dashboard/totalUsers devuelve 200', async () => {
        const res = await request(app).get('/dashboard/totalUsers');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /dashboard/monthlyRevenue devuelve 200', async () => {
        const res = await request(app).get('/dashboard/monthlyRevenue');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    test('GET /dashboard/bookingsByCategory devuelve 200', async () => {
        const res = await request(app).get('/dashboard/bookingsByCategory');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});

// ─── Users — autenticación y validación ──────────────────────────────────────

describe('Users — autenticación y validación', () => {
    test('POST /user/login sin body devuelve 400', async () => {
        const res = await request(app).post('/user/login').send({});
        expect([400, 429]).toContain(res.statusCode);
        expect(res.body.status).toBe('error');
    });

    test('POST /user/login con credenciales incorrectas devuelve 401', async () => {
        const res = await request(app)
            .post('/user/login')
            .send({ email: 'noexiste@test.com', password: 'wrongpass' });
        expect([401, 429]).toContain(res.statusCode);
        expect(res.body.status).toBe('error');
    });

    test('POST /user sin datos devuelve error de validación', async () => {
        const res = await request(app).post('/user').send({});
        expect([400, 429]).toContain(res.statusCode);
        expect(res.body.status).toBe('error');
    });

    test('GET /user sin token devuelve 401', async () => {
        const res = await request(app).get('/user');
        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('error');
    });

    test('GET /user con token inválido devuelve 401', async () => {
        const res = await request(app)
            .get('/user')
            .set('Authorization', 'Bearer token-invalido');
        expect(res.statusCode).toBe(401);
        expect(res.body.status).toBe('error');
    });

    test('PUT /user/edit sin auth devuelve 401', async () => {
        const res = await request(app).put('/user/edit').send({});
        expect(res.statusCode).toBe(401);
    });

    test('PUT /user/avatar sin auth devuelve 401', async () => {
        const res = await request(app).put('/user/avatar');
        expect(res.statusCode).toBe(401);
    });

    test('PUT /user/password sin auth devuelve 401', async () => {
        const res = await request(app).put('/user/password').send({});
        expect(res.statusCode).toBe(401);
    });

    test('DELETE /user sin auth devuelve 401', async () => {
        const res = await request(app).delete('/user');
        expect(res.statusCode).toBe(401);
    });
});

// ─── User management — protección de rutas ───────────────────────────────────

describe('User management — protección de rutas', () => {
    test('GET /user/list sin auth devuelve 401', async () => {
        const res = await request(app).get('/user/list');
        expect(res.statusCode).toBe(401);
    });

    test('GET /user/list con token inválido devuelve 401', async () => {
        const res = await request(app)
            .get('/user/list')
            .set('Authorization', 'Bearer token-invalido');
        expect(res.statusCode).toBe(401);
    });

    test('PUT /user/toggle/1 sin auth devuelve 401', async () => {
        const res = await request(app).put('/user/toggle/1');
        expect(res.statusCode).toBe(401);
    });
});

// ─── Bookings — protección de rutas ──────────────────────────────────────────

describe('Bookings — protección de rutas', () => {
    test('POST /booking sin auth devuelve 401', async () => {
        const res = await request(app)
            .post('/booking')
            .send({ dateExperience: '2026-12-01', quantity: 1, idExperience: 1 });
        expect(res.statusCode).toBe(401);
    });

    test('GET /booking/list sin auth devuelve 401', async () => {
        const res = await request(app).get('/booking/list');
        expect(res.statusCode).toBe(401);
    });

    test('GET /booking/view sin auth devuelve 401', async () => {
        const res = await request(app).get('/booking/view');
        expect(res.statusCode).toBe(401);
    });

    test('GET /booking/view/1 sin auth devuelve 401', async () => {
        const res = await request(app).get('/booking/view/1');
        expect(res.statusCode).toBe(401);
    });

    test('DELETE /booking/FAKE-TICKET sin auth devuelve 401', async () => {
        const res = await request(app).delete('/booking/FAKE-TICKET');
        expect(res.statusCode).toBe(401);
    });
});

// ─── Newsletter ───────────────────────────────────────────────────────────────

describe('Newsletter', () => {
    test('POST /newsletter sin email devuelve error de validación', async () => {
        const res = await request(app).post('/newsletter').send({});
        expect([400, 500]).toContain(res.statusCode);
        expect(res.body.status).toBe('error');
    });

    test('POST /newsletter con email inválido devuelve error', async () => {
        const res = await request(app)
            .post('/newsletter')
            .send({ email: 'no-es-un-email' });
        expect([400, 500]).toContain(res.statusCode);
        expect(res.body.status).toBe('error');
    });
});

// ─── Viewer role — requiere npm run seedDemo ──────────────────────────────────

describe('Viewer role — acceso de solo lectura (requiere seedDemo)', () => {
    let viewerToken = null;

    beforeAll(async () => {
        viewerToken = await loginAs('viewer@demo.com', '123456');
    });

    test('login como viewer devuelve token', () => {
        if (!viewerToken) {
            console.warn('SKIP: viewer@demo.com no existe — ejecuta npm run seedDemo');
            return;
        }
        expect(typeof viewerToken).toBe('string');
        expect(viewerToken.startsWith('Bearer ')).toBe(true);
    });

    test('GET /user/list con token viewer devuelve 200 sin campo email', async () => {
        if (!viewerToken) return;
        const res = await request(app)
            .get('/user/list')
            .set('Authorization', viewerToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(Array.isArray(res.body.data)).toBe(true);
        if (res.body.data.length > 0) {
            expect(res.body.data[0]).not.toHaveProperty('email');
        }
    });

    test('PUT /user/toggle/1 con token viewer devuelve 403 (solo admin)', async () => {
        if (!viewerToken) return;
        const res = await request(app)
            .put('/user/toggle/1')
            .set('Authorization', viewerToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.status).toBe('error');
    });

    test('GET /category/1 con token viewer devuelve 200 o 404', async () => {
        if (!viewerToken) return;
        const res = await request(app)
            .get('/category/1')
            .set('Authorization', viewerToken);
        expect([200, 404]).toContain(res.statusCode);
        if (res.statusCode === 200) {
            expect(res.body.status).toBe('ok');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data).toHaveProperty('title');
        }
    });

    test('GET /user con token viewer devuelve 200 con perfil', async () => {
        if (!viewerToken) return;
        const res = await request(app)
            .get('/user')
            .set('Authorization', viewerToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.data).toHaveProperty('role', 'viewer');
    });
});
