const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const itemsRoute = require('./routes/items');
const authMiddleware = require('./middleware/auth');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Routes
app.use('/api/items', authMiddleware, itemsRoute);

// Health check
app.get('/health', (req, res) => res.status(200).send('API is healthy'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));