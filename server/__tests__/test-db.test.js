const request = require('supertest');
const express = require('express');
const { testDatabaseConnection, connection } = require('../routes');

const app = express();
app.get('/test-db', testDatabaseConnection);

// set timeout for all tests
jest.setTimeout(1000);

describe('GET /test-db', () => {
  it('should return a successful database connection message', async () => {
    console.log("testing test-db route");
    const response = await request(app).get('/test-db');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Database connected successfully');
    expect(response.body).toHaveProperty('result');
  });

  it('should return an error message on database connection failure', async () => {
    console.log("testing test-db route failure");
    jest.spyOn(connection, 'query').mockImplementationOnce(() => {
      throw new Error('Connection failed');
    });

    const response = await request(app).get('/test-db');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to connect to the database');
  });
}); 