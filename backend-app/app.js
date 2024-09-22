const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { swaggerUi, specs } = require('./swagger');
const envVars = require('./config/validationEnv');
const itemsRoute = require('./routes/items');
const authRoute = require('./routes/auth');
const connectDB = require('./config/dbs');
const logger = require('./utils/logger');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false })); // Adjust CSP as needed
app.use(morgan('combined', { stream: logger.stream }));
app.use(express.static(path.join(__dirname, 'public')));

// Validate environment variables
envVars;

// Database connection
connectDB();

// Rate Limiting Configuration
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(globalLimiter);

// Routes
app.use('/api/auth', authRoute);
app.use('/api/items', auth, itemsRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Favicon
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'public', 'favicon.ico')));

// Health check
app.get('/health', (req, res) => res.status(200).send('API is healthy'));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message, err);
  res.status(500).json({ message: 'Something went wrong' });
});

module.exports = app;
