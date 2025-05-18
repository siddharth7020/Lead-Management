const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth(['super_admin']), userController.getUsers);
router.put('/:id', auth(['super_admin']), userController.updateUser);
router.delete('/:id', auth(['super_admin']), userController.deleteUser);
router.get('/:id/logs', auth(['super_admin']), userController.getActivityLogs);

module.exports = router;