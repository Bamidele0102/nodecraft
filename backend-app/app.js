const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const itemsRoute = require('./routes/items');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const authRoute = require('./routes/auth');
const { swaggerUi, specs } = require('./swagger');
const envVars = require('./config/validationEnv');
const auth = require('./middleware/auth');
const path = require('path');

const app = express();

console.log('JWT Secret for registration:', process.env.JWT_SECRET);

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Logger Middleware
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});

// Validate environment variables
envVars;

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
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error:', err));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', limiter, authRoute);
app.use('/api/items', auth, limiter, itemsRoute);

// Health check
app.get('/health', (req, res) => res.status(200).send('API is healthy'));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});


// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.message, err);
    res.status(500).send('Something went wrong');
});

module.exports = app;
