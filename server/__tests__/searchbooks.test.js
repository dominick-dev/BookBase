const request = require('supertest');
const express = require('express');
const { searchBooks, connection } = require('../routes');

const app = express();
app.use(express.json());
app.get('/searchBooks', searchBooks);

beforeEach(() => {
  // Clear the console before each test
  console.clear();
});

afterEach(() => {
  // Clear the console after each test
  console.clear();
});

// set timeout for all tests
jest.setTimeout(10000);

// test searchBooks route
describe('GET /searchBooks', () => {
  it('should return books matching the searchBooks query', async () => {
    console.log("testing searchBooks route");
    const response = await request(app)
      .get('/searchBooks?limit=5')
      .set('Cache-Control', 'no-cache');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(5);
    // Check if each book has the expected properties
    response.body.forEach(book => {
      expect(book).toHaveProperty('author');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('genre_id');
      expect(book).toHaveProperty('isbn');
      expect(book).toHaveProperty('num_pages');
      expect(book).toHaveProperty('publisher');
      expect(book).toHaveProperty('published_date');
      expect(book).toHaveProperty('description');
      expect(book).toHaveProperty('preview_link');
      expect(book).toHaveProperty('info_link');
      expect(book).toHaveProperty('image');
      expect(book).toHaveProperty('avg_review');
    });
  });
});