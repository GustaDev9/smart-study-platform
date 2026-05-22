const { pool } = require('../config/database');

class SubjectRepository {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT s.*, COUNT(t.id) as topic_count
       FROM subjects s
       LEFT JOIN topics t ON t.subject_id = s.id
       GROUP BY s.id
       ORDER BY s.name ASC`
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM subjects WHERE id = ?', [id]);
    return rows[0] || null;
  }

  async findTopicsBySubjectId(subjectId) {
    const [rows] = await pool.execute(
      `SELECT t.*, COUNT(q.id) as question_count
       FROM topics t
       LEFT JOIN questions q ON q.topic_id = t.id
       WHERE t.subject_id = ?
       GROUP BY t.id
       ORDER BY t.name ASC`,
      [subjectId]
    );
    return rows;
  }
}

module.exports = new SubjectRepository();
