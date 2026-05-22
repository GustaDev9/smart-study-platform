const questionRepository = require('../repositories/questionRepository');

class QuestionController {
  async byTopic(req, res) {
    try {
      const { id } = req.params;
      const questions = await questionRepository.findByTopicId(id);
      return res.status(200).json({ success: true, data: questions });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  }
}

module.exports = new QuestionController();
