import request from 'supertest';
import app from '../app';
import { database } from '../config/database';

describe('Anomaly Alert API', () => {
  beforeAll(async () => {
    // Connect to test database
    await database.connect();
  });

  afterAll(async () => {
    // Disconnect from database
    await database.disconnect();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/alerts', () => {
    it('should return empty alerts list initially', async () => {
      const response = await request(app)
        .get('/api/alerts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.alerts).toEqual([]);
      expect(response.body.data.total).toBe(0);
    });

    it('should handle query parameters', async () => {
      const response = await request(app)
        .get('/api/alerts?page=1&limit=5&alertType=severe')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('alerts');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('page', 1);
      expect(response.body.data).toHaveProperty('limit', 5);
    });
  });

  describe('GET /api/alerts/:id', () => {
    it('should return 404 for non-existent alert', async () => {
      const response = await request(app)
        .get('/api/alerts/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Alert not found');
    });
  });

  describe('PUT /api/alerts/:id', () => {
    it('should return 404 for non-existent alert', async () => {
      const response = await request(app)
        .put('/api/alerts/507f1f77bcf86cd799439011')
        .send({
          action: 'Test action',
          comment: 'Test comment'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Alert not found');
    });
  });

  describe('POST /api/alerts/upload', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/alerts/upload')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Audio file is required');
    });
  });
}); 