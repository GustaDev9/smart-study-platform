const { pool } = require("../config/database");

class UserRepository {
    async findById(id) {
    const [rows] = await pool.execute(
        "SELECT id, name, email FROM users WHERE id = ?",
        [id]
    );

    return rows[0];
    }

    async findByEmail(email) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
    }

    async emailExists(email) {
    const [rows] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    return rows.length > 0;
    }

    async create({ name, email, password }) {
    const [result] = await pool.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password]
    );

    return {
        id: result.insertId,
        name,
        email,
    };
    }
}

module.exports = new UserRepository();