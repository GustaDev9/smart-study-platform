const { pool } = require('../databases/database');

class ProgressRepository {
  async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT 
        p.*,
        t.name as topic_name,
        s.name as subject_name,
        s.icon as subject_icon,
        s.color as subject_color,
        ROUND(
          (p.correct_count / NULLIF(p.correct_count + p.wrong_count, 0)) * 100, 1
        ) as accuracy_rate
       FROM progress p
       JOIN topics t ON t.id = p.topic_id
       JOIN subjects s ON s.id = t.subject_id
       WHERE p.user_id = ?
       ORDER BY p.last_studied_at DESC`,
      [userId]
    );
    return rows;
  }

  async findByUserAndTopic(userId, topicId) {
    const [rows] = await pool.execute(
      'SELECT * FROM progress WHERE user_id = ? AND topic_id = ?',
      [userId, topicId]
    );
    return rows[0] || null;
  }

  async upsertProgress(userId, topicId, isCorrect) {
    const existing = await this.findByUserAndTopic(userId, topicId);

    if (existing) {
      const field = isCorrect ? 'correct_count' : 'wrong_count';
      await pool.execute(
        `UPDATE progress SET ${field} = ${field} + 1 WHERE user_id = ? AND topic_id = ?`,
        [userId, topicId]
      );
    } else {
      const correctCount = isCorrect ? 1 : 0;
      const wrongCount = isCorrect ? 0 : 1;
      await pool.execute(
        'INSERT INTO progress (user_id, topic_id, correct_count, wrong_count) VALUES (?, ?, ?, ?)',
        [userId, topicId, correctCount, wrongCount]
      );
    }
  }

  async saveUserAnswer(userId, questionId, answerId, isCorrect) {
    const [result] = await pool.execute(
      'INSERT INTO user_answers (user_id, question_id, answer_id, is_correct) VALUES (?, ?, ?, ?)',
      [userId, questionId, answerId, isCorrect ? 1 : 0]
    );
    return result.insertId;
  }

  async getTopicOfQuestion(questionId) {
    const [rows] = await pool.execute(
      'SELECT topic_id FROM questions WHERE id = ?',
      [questionId]
    );
    return rows[0]?.topic_id || null;
  }

  async getUserSummary(userId) {
    const [rows] = await pool.execute(
      `SELECT 
        SUM(correct_count) as total_correct,
        SUM(wrong_count) as total_wrong,
        SUM(correct_count + wrong_count) as total_answered,
        COUNT(DISTINCT topic_id) as topics_studied,
        ROUND(
          SUM(correct_count) / NULLIF(SUM(correct_count + wrong_count), 0) * 100, 1
        ) as overall_accuracy
       FROM progress
       WHERE user_id = ?`,
      [userId]
    );
    return rows[0];
  }
}

module.exports = new ProgressRepository();
