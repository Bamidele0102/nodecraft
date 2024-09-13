const logger = require('../logger');


module.exports = (err, req, res, next) => {
    logger.error(err.message, err);


    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }


    res.status(500).json({ message: 'Something went wrong!' });
};
