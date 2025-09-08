const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  submitRating,
  getUserRatingForStore,
  getStoreRatings
} = require('../controllers/ratingController');

router.post('/', auth, submitRating);
router.get('/user/:storeId', auth, getUserRatingForStore);
router.get('/store/:storeId', auth, getStoreRatings);

module.exports = router;
