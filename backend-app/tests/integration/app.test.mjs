import request from 'supertest';
import app from '../../app.js'; // Ensure the correct path and file extension
import chai from 'chai';

const { expect } = chai;

describe('App', () => {
    it('should return API is healthy', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.equal('API is healthy');
    });
});
