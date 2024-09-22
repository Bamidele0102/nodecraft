const Item = require('../models/Items');

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.error('Error retrieving items:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            console.error(`Item not found with ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        console.error(`Error retrieving item with ID: ${req.params.id}`, err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createItem = async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error
            console.error('Duplicate item name:', err);
            return res.status(400).json({ message: 'Item with this name already exists' });
        }
        console.error('Error creating item:', err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            console.error(`Item not found with ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error
            console.error('Duplicate item name:', err);
            return res.status(400).json({ message: 'Item with this name already exists' });
        }
        console.error(`Error updating item with ID: ${req.params.id}`, err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            console.error(`Item not found with ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted' });
    } catch (err) {
        console.error(`Error deleting item with ID: ${req.params.id}`, err);
        res.status(500).json({ message: 'Server error' });
    }
};
