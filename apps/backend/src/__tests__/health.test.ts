import request from 'supertest';
import express from 'express';

const app = express();

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Restaurant MERN API is running!',
    data: {
      timestamp: new Date().toISOString(),
      environment: 'test',
      version: '1.0.0'
    }
  });
});

describe('Health Check Endpoint', () => {
  it('should return 200 and success message', async () => {
    const response = await request(app)
      .get('/api/v1/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Restaurant MERN API is running!');
    expect(response.body.data).toHaveProperty('timestamp');
    expect(response.body.data).toHaveProperty('version', '1.0.0');
  });
});
