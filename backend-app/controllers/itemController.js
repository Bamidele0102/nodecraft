const Item = require('../models/Items');

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createItem = async (req, res) => {
    const item = new Item({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        description: req.body.description // Include the description field
    });
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error code
            res.status(400).json({ message: 'Item with this name already exists' });
        } else {
            res.status(400).json({ message: err.message });
        }
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        item.name = req.body.name || item.name;
        item.quantity = req.body.quantity || item.quantity;
        item.price = req.body.price || item.price;
        item.description = req.body.description || item.description; // Include the description field

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await Item.deleteOne({ _id: req.params.id }); // Use deleteOne method
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
