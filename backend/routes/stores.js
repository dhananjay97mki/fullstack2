const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const {
  createStore,
  getAllStores,
  getStoreById,
  getStoresByUser
} = require('../controllers/storeController');

router.post('/', auth, roleAuth(['admin']), createStore);
router.get('/', auth, getAllStores);
router.get('/my-store', auth, roleAuth(['store_owner']), getStoresByUser);
router.get('/:id', auth, getStoreById);

module.exports = router;
