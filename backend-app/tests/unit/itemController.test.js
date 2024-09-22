const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const Item = require('../../models/Items');
const itemController = require('../../controllers/itemController');

describe('ItemController Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getItems', () => {
        it('should return all items', async () => {
            const items = [{ name: 'Item1' }, { name: 'Item2' }];
            sinon.stub(Item, 'find').resolves(items);

            await itemController.getItems(req, res, next);

            expect(res.json.calledWith(items)).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            sinon.stub(Item, 'find').rejects(error);

            await itemController.getItems(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Server error' })).to.be.true;
        });
    });

    describe('getItemById', () => {
        it('should return an item by ID', async () => {
            const item = { name: 'Item1' };
            req.params.id = '1';
            sinon.stub(Item, 'findById').resolves(item);

            await itemController.getItemById(req, res, next);

            expect(res.json.calledWith(item)).to.be.true;
        });

        it('should handle item not found', async () => {
            req.params.id = '1';
            sinon.stub(Item, 'findById').resolves(null);

            await itemController.getItemById(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            req.params.id = '1';
            sinon.stub(Item, 'findById').rejects(error);

            await itemController.getItemById(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Server error' })).to.be.true;
        });
    });

    describe('createItem', () => {
        it('should create a new item', async () => {
            const newItem = { name: 'Item1' };
            req.body = newItem;
            sinon.stub(Item.prototype, 'save').resolves(newItem);

            await itemController.createItem(req, res, next);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(newItem)).to.be.true;
        });

        it('should handle duplicate item error', async () => {
            const error = { code: 11000 };
            req.body = { name: 'Item1' };
            sinon.stub(Item.prototype, 'save').rejects(error);

            await itemController.createItem(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Item with this name already exists' })).to.be.true;
        });

        it('should handle other errors', async () => {
            const error = new Error('Validation error');
            req.body = { name: 'Item1' };
            sinon.stub(Item.prototype, 'save').rejects(error);

            await itemController.createItem(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Bad request' })).to.be.true;
        });
    });

    describe('updateItem', () => {
        it('should update an item by ID', async () => {
            const updatedItem = { name: 'Updated Item' };
            req.params.id = '1';
            req.body = updatedItem;
            sinon.stub(Item, 'findByIdAndUpdate').resolves(updatedItem);

            await itemController.updateItem(req, res, next);

            expect(res.json.calledWith(updatedItem)).to.be.true;
        });

        it('should handle item not found', async () => {
            req.params.id = '1';
            req.body = { name: 'Updated Item' };
            sinon.stub(Item, 'findByIdAndUpdate').resolves(null);

            await itemController.updateItem(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
        });

        it('should handle duplicate item error', async () => {
            const error = { code: 11000 };
            req.params.id = '1';
            req.body = { name: 'Updated Item' };
            sinon.stub(Item, 'findByIdAndUpdate').rejects(error);

            await itemController.updateItem(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Item with this name already exists' })).to.be.true;
        });

        it('should handle other errors', async () => {
            const error = new Error('Validation error');
            req.params.id = '1';
            req.body = { name: 'Updated Item' };
            sinon.stub(Item, 'findByIdAndUpdate').rejects(error);

            await itemController.updateItem(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Bad request' })).to.be.true;
        });
    });

    describe('deleteItem', () => {
        it('should delete an item by ID', async () => {
            const deletedItem = { name: 'Deleted Item' };
            req.params.id = '1';
            sinon.stub(Item, 'findByIdAndDelete').resolves(deletedItem);

            await itemController.deleteItem(req, res, next);

            expect(res.json.calledWith({ message: 'Item deleted' })).to.be.true;
        });

        it('should handle item not found', async () => {
            req.params.id = '1';
            sinon.stub(Item, 'findByIdAndDelete').resolves(null);

            await itemController.deleteItem(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            req.params.id = '1';
            sinon.stub(Item, 'findByIdAndDelete').rejects(error);

            await itemController.deleteItem(req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Server error' })).to.be.true;
        });
    });
});
