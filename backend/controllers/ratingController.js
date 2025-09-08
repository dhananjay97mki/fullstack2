const Rating = require('../models/Rating');

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    
    if (!storeId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating. Must be between 1 and 5' });
    }

    const newRating = await Rating.create({
      userId: req.user.id,
      storeId,
      rating
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserRatingForStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const rating = await Rating.findByUserAndStore(req.user.id, storeId);
    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const ratings = await Rating.findByStoreId(storeId);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitRating,
  getUserRatingForStore,
  getStoreRatings
};
