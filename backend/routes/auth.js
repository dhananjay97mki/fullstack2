const express = require('express');
const router = express.Router();
const { register, login, updatePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.put('/update-password', auth, updatePassword);

module.exports = router;
