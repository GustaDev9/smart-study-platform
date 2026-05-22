const progressService = require('../services/progressService');

class ProgressController {
  async submitAnswer(req, res) {
    try {
      const { question_id, answer_id } = req.body;
      const userId = req.user.id;
      if (!question_id || !answer_id) {
        return res.status(400).json({ success: false, message: 'question_id e answer_id são obrigatórios' });
      }
      const result = await progressService.submitAnswer({ userId, questionId: question_id, answerId: answer_id });
      return res.status(200).json({
        success: true,
        message: result.is_correct ? '✅ Resposta correta!' : '❌ Resposta incorreta',
        data: result,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getProgress(req, res) {
    try {
      const userId = req.user.id;
      const progress = await progressService.getUserProgress(userId);
      return res.status(200).json({ success: true, data: progress });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  }
}

module.exports = new ProgressController();
