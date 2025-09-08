const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ name, email, password, address, role = 'normal' }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const query = `
      INSERT INTO users (name, email, password, address, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, address, role, created_at
    `;
    const result = await pool.query(query, [name, email, hashedPassword, address, role]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
             COALESCE(AVG(r.rating), 0) as rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'store_owner'
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    
    const conditions = [];
    const values = [];
    let paramCount = 0;

    if (filters.name) {
      paramCount++;
      conditions.push(`u.name ILIKE $${paramCount}`);
      values.push(`%${filters.name}%`);
    }
    if (filters.email) {
      paramCount++;
      conditions.push(`u.email ILIKE $${paramCount}`);
      values.push(`%${filters.email}%`);
    }
    if (filters.address) {
      paramCount++;
      conditions.push(`u.address ILIKE $${paramCount}`);
      values.push(`%${filters.address}%`);
    }
    if (filters.role) {
      paramCount++;
      conditions.push(`u.role = $${paramCount}`);
      values.push(filters.role);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY u.id, u.name, u.email, u.address, u.role, u.created_at';
    
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY u.${filters.sortBy} ${sortOrder}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const query = 'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await pool.query(query, [hashedPassword, id]);
  }

  static async getTotalCount() {
    const query = 'SELECT COUNT(*) as count FROM users';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }
}

module.exports = User;
