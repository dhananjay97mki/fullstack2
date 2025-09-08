const { pool } = require('../config/database');

class Rating {
  static async create({ userId, storeId, rating }) {
    const query = `
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, store_id)
      DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [userId, storeId, rating]);
    return result.rows[0];
  }

  static async findByUserAndStore(userId, storeId) {
    const query = 'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2';
    const result = await pool.query(query, [userId, storeId]);
    return result.rows[0];
  }

  static async findByStoreId(storeId) {
    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [storeId]);
    return result.rows;
  }

  static async getTotalCount() {
    const query = 'SELECT COUNT(*) as count FROM ratings';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Rating;
