const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const itemsRoute = require('./routes/items');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Routes
app.use('/api/items', itemsRoute);

// Health check
// app.get('/health', (req, res) => res.status(200).send('API is healthy'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
