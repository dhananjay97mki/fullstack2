require('dotenv').config();
const app = require('./app');
const { createTables } = require('./config/database');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
