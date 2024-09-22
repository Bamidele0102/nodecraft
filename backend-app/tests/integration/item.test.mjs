import request from 'supertest';
import mongoose from 'mongoose';
import chai from 'chai';
import app from '../../app.js'; // Ensure the correct path and file extension
import Item from '../../models/Items.js'; // Import the Item model

const { expect } = chai;

describe('Items API Integration Tests', function() {
    this.timeout(30000); // Increase the timeout for the entire suite

    let token;
    let createdItemId;

    // Set up a connection before running tests
    before((done) => {
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                // Log in to get a token
                request(app)
                    .post('/api/auth/login')
                    .send({ username: 'testuser', password: 'testpassword' }) // Replace with valid credentials
                    .end((err, res) => {
                        if (err) return done(err);
                        token = res.body.token; // Assuming the token is in res.body.token
                        done();
                    });
            })
            .catch((err) => {
                console.error('Error connecting to the database:', err);
                done(err);
            });
    });

    // Clean up after all tests are finished
    after((done) => {
        Item.deleteMany({})
            .then(() => mongoose.connection.close())
            .then(() => done())
            .catch((err) => {
                console.error('Error during after hook:', err);
                done(err);
            });
    });

    // Clear the collections before each test
    beforeEach((done) => {
        Item.deleteMany({})
            .then(() => done())
            .catch((err) => {
                console.error('Error during beforeEach hook:', err);
                done(err);
            });
    });

    it('should create a new item', (done) => {
        request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Item', quantity: 10, price: 99.99, description: 'Test Description' })
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error('Create Item Error:', res.body);
                    return done(err);
                }
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('name').eql('Test Item');
                expect(res.body).to.have.property('quantity').eql(10);
                expect(res.body).to.have.property('price').eql(99.99);
                expect(res.body).to.have.property('description').eql('Test Description');
                createdItemId = res.body._id;
                console.log('Created Item ID:', createdItemId); // Log the created item ID
                done();
            });
    });

    it('should get all items', (done) => {
        request(app)
            .get('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should get a single item by ID', (done) => {
        request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Item', quantity: 10, price: 99.99, description: 'Test Description' })
            .end((err, res) => {
                if (err) return done(err);
                createdItemId = res.body._id;
                request(app)
                    .get(`/api/items/${createdItemId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            console.error('Get Item Error:', res.body);
                            return done(err);
                        }
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('_id').eql(createdItemId);
                        done();
                    });
            });
    });

    it('should update an item by ID', (done) => {
        request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Item', quantity: 10, price: 99.99, description: 'Test Description' })
            .end((err, res) => {
                if (err) return done(err);
                createdItemId = res.body._id;
                request(app)
                    .put(`/api/items/${createdItemId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'Updated Item', quantity: 20, price: 199.99, description: 'Updated Description' })
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            console.error('Update Item Error:', res.body);
                            return done(err);
                        }
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('name').eql('Updated Item');
                        expect(res.body).to.have.property('quantity').eql(20);
                        expect(res.body).to.have.property('price').eql(199.99);
                        expect(res.body).to.have.property('description').eql('Updated Description');
                        done();
                    });
            });
    });

    it('should delete an item by ID', (done) => {
        request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Item', quantity: 10, price: 99.99, description: 'Test Description' })
            .end((err, res) => {
                if (err) return done(err);
                createdItemId = res.body._id;
                request(app)
                    .delete(`/api/items/${createdItemId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            console.error('Delete Item Error:', res.body);
                            return done(err);
                        }
                        done();
                    });
            });
    });

    it('should not create a duplicate item', (done) => {
        request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Test Item', quantity: 10, price: 99.99, description: 'Test Description' })
            .end((err, res) => {
                if (err) return done(err);
                request(app)
                    .post('/api/items')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'Test Item', quantity: 10, price: 99.99, description: 'Test Description' })
                    .expect(400)
                    .end((err, res) => {
                        if (err) {
                            console.error('Duplicate Item Error:', res.body);
                            return done(err);
                        }
                        expect(res.body).to.have.property('message').eql('Item with this name already exists');
                        done();
                    });
            });
    });
});
