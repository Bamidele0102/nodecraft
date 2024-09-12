const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const itemsRoute = require('./routes/items');
const authMiddleware = require('./middleware/auth');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const rateLimit = require('express-rate-limit');
const authRoute = require('./routes/auth');
const { swaggerUi, specs } = require('./swagger');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate Limiting Configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all requests
app.use(limiter);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authMiddleware, limiter, authRoute);
app.use('/api/items', authMiddleware, limiter, itemsRoute);

// Health check
app.get('/health', (req, res) => res.status(200).send('API is healthy'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));