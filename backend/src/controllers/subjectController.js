const subjectRepository = require('../repositories/subjectRepository');

class SubjectController {
  async index(req, res) {
    try {
      const subjects = await subjectRepository.findAll();
      return res.status(200).json({ success: true, data: subjects });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  }

  async topics(req, res) {
    try {
      const { id } = req.params;
      const subject = await subjectRepository.findById(id);
      if (!subject) {
        return res.status(404).json({ success: false, message: 'Matéria não encontrada' });
      }
      const topics = await subjectRepository.findTopicsBySubjectId(id);
      return res.status(200).json({ success: true, data: { subject, topics } });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  }
}

module.exports = new SubjectController();
