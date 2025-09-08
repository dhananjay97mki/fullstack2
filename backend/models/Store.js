const { pool } = require('../config/database');

class Store {
  static async create({ name, email, address, ownerId }) {
    const query = `
      INSERT INTO stores (name, email, address, owner_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [name, email, address, ownerId]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT s.*, COALESCE(AVG(r.rating), 0) as rating, COUNT(r.id) as rating_count
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    
    const conditions = [];
    const values = [];
    let paramCount = 0;

    if (filters.name) {
      paramCount++;
      conditions.push(`s.name ILIKE $${paramCount}`);
      values.push(`%${filters.name}%`);
    }
    if (filters.address) {
      paramCount++;
      conditions.push(`s.address ILIKE $${paramCount}`);
      values.push(`%${filters.address}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at';
    
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY s.${filters.sortBy} ${sortOrder}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT s.*, COALESCE(AVG(r.rating), 0) as rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByOwnerId(ownerId) {
    const query = `
      SELECT s.*, COALESCE(AVG(r.rating), 0) as rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1
      GROUP BY s.id
    `;
    const result = await pool.query(query, [ownerId]);
    return result.rows[0];
  }

  static async getTotalCount() {
    const query = 'SELECT COUNT(*) as count FROM stores';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Store;
