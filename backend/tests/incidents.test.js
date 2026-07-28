import request from 'supertest';
import app from '../index.js';
import pool from '../database/conexion.js';

describe('API de Incidentes', () => {
  
  afterAll(async () => {
    // Cerramos el pool de conexiones al terminar las pruebas
    await pool.end();
  });

  describe('GET /api/incidents', () => {
    it('debería bloquear el acceso si no hay Token JWT (401)', async () => {
      const response = await request(app).get('/api/incidents');
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toMatch(/Acceso denegado/);
    });
  });

  describe('POST /api/incidents', () => {
    it('debería bloquear la creación si no hay Token JWT (401)', async () => {
      const nuevoIncidente = {
        title: 'Fuga de agua',
        description: 'Hay una tubería rota en el baño',
        category: 'mantenimiento',
        priority: 'high',
        location: 'Edificio de Sistemas'
      };

      const response = await request(app)
        .post('/api/incidents')
        .send(nuevoIncidente);

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toMatch(/Acceso denegado/);
    });
  });

});
