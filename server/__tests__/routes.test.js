const request = require('supertest');
const express = require('express');
const { search, connection } = require('../routes');

const app = express();
app.use(express.json());
app.get('/search', search);

describe('GET /search', () => {
  it('should return books matching the search query', async () => {
    const response = await request(app)
      .get('/search?field=title&query=someTitle&limit=5');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Add more assertions based on expected response structure
  });

  it('should return 400 for invalid field', async () => {
    const response = await request(app)
      .get('/search?field=invalidField&query=someTitle');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', "Invalid search parameter");
  });

  it('should return 500 for server error', async () => {
    // Mock the connection.query method to simulate an error
    jest.spyOn(connection, 'query').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request(app)
      .get('/search?field=title&query=someTitle');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', "Failed to execute search query");
  });

  it('should default limit to 10 if not provided', async () => {
    const response = await request(app)
      .get('/search?field=title&query=someTitle');
    
    expect(response.status).toBe(200);
    // Check if the limit is applied correctly in the response
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });
}); 