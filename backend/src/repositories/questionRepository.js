const { pool } = require('../config/database');

class QuestionRepository {
  async findByTopicId(topicId) {
    const [questions] = await pool.execute(
      `SELECT id, statement, difficulty, explanation FROM questions WHERE topic_id = ? ORDER BY RAND()`,
      [topicId]
    );
    for (const question of questions) {
      const [answers] = await pool.execute(
        'SELECT id, text FROM answers WHERE question_id = ? ORDER BY RAND()',
        [question.id]
      );
      question.answers = answers;
    }
    return questions;
  }

  async findById(questionId) {
    const [rows] = await pool.execute('SELECT * FROM questions WHERE id = ?', [questionId]);
    return rows[0] || null;
  }

  async findAnswerById(answerId) {
    const [rows] = await pool.execute('SELECT * FROM answers WHERE id = ?', [answerId]);
    return rows[0] || null;
  }

  async findCorrectAnswer(questionId) {
    const [rows] = await pool.execute(
      'SELECT * FROM answers WHERE question_id = ? AND is_correct = 1',
      [questionId]
    );
    return rows[0] || null;
  }
}

module.exports = new QuestionRepository();
