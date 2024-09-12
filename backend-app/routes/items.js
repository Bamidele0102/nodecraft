const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const validationMiddleware = require('../middleware/validation');


router.get('/', itemController.getItems);
router.post('/', validationMiddleware, itemController.createItem);
router.put('/:id', validationMiddleware, itemController.updateItem);
router.delete('/:id', itemController.deleteItem);


module.exports = router;