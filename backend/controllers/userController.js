const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { validateUser } = require('../utils/validators');

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    const validation = validateUser({ name, email, password, address });
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, address, role });
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;
    const filters = { name, email, address, role, sortBy, sortOrder };
    
    const users = await User.findAll(filters);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.getTotalCount();
    const totalStores = await Store.getTotalCount();
    const totalRatings = await Rating.getTotalCount();
    
    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getDashboardStats
};
