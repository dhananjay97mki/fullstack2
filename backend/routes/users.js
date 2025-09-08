const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const {
  createUser,
  getAllUsers,
  getUserById,
  getDashboardStats
} = require('../controllers/userController');

router.post('/', auth, roleAuth(['admin']), createUser);
router.get('/', auth, roleAuth(['admin']), getAllUsers);
router.get('/stats', auth, roleAuth(['admin']), getDashboardStats);
router.get('/:id', auth, roleAuth(['admin']), getUserById);

module.exports = router;
