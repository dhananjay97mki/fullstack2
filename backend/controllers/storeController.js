const Store = require('../models/Store');
const User = require('../models/User');
const { validateStore } = require('../utils/validators');

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerName, ownerEmail, ownerPassword, ownerAddress } = req.body;
    
    const storeValidation = validateStore({ name, email, address });
    if (!storeValidation.isValid) {
      return res.status(400).json({ message: storeValidation.message });
    }

    // Create store owner user first
    const existingOwner = await User.findByEmail(ownerEmail);
    if (existingOwner) {
      return res.status(400).json({ message: 'Store owner email already exists' });
    }

    const owner = await User.create({
      name: ownerName,
      email: ownerEmail,
      password: ownerPassword,
      address: ownerAddress,
      role: 'store_owner'
    });

    // Create store
    const store = await Store.create({
      name,
      email,
      address,
      ownerId: owner.id
    });

    res.status(201).json({
      message: 'Store and owner created successfully',
      store,
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy, sortOrder } = req.query;
    const filters = { name, address, sortBy, sortOrder };
    
    const stores = await Store.findAll(filters);
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getStoresByUser = async (req, res) => {
  try {
    const store = await Store.findByOwnerId(req.user.id);
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  getStoresByUser
};
