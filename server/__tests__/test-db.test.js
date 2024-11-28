const request = require('supertest');
const express = require('express');
const { testDatabaseConnection, connection } = require('../routes');

const app = express();
app.get('/test-db', testDatabaseConnection); // Set up the route for testing

describe('GET /test-db', () => {
  it('should return a successful database connection message', async () => {
    const response = await request(app).get('/test-db');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Database connected successfully');
    expect(response.body).toHaveProperty('result');
  });

  it('should return an error message on database connection failure', async () => {
    // Mock the connection.query method to simulate a failure
    jest.spyOn(connection, 'query').mockImplementationOnce(() => {
      throw new Error('Connection failed');
    });

    const response = await request(app).get('/test-db');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to connect to the database');
  });
}); 