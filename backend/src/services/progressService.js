const progressRepository = require('../repositories/progressRepository');
const questionRepository = require('../repositories/questionRepository');

class ProgressService {
  async submitAnswer({ userId, questionId, answerId }) {
    // Valida se a questão existe
    const question = await questionRepository.findById(questionId);
    if (!question) {
      throw new Error('Questão não encontrada');
    }

    // Valida se a resposta pertence à questão
    const answer = await questionRepository.findAnswerById(answerId);
    if (!answer || answer.question_id !== questionId) {
      throw new Error('Alternativa inválida para esta questão');
    }

    const isCorrect = answer.is_correct === 1;
    const topicId = question.topic_id;

    // Salva a resposta do usuário
    await progressRepository.saveUserAnswer(userId, questionId, answerId, isCorrect);

    // Atualiza o progresso
    await progressRepository.upsertProgress(userId, topicId, isCorrect);

    // Busca resposta correta para retornar ao usuário
    const correctAnswer = await questionRepository.findCorrectAnswer(questionId);

    return {
      is_correct: isCorrect,
      correct_answer_id: correctAnswer?.id,
      explanation: question.explanation,
    };
  }

  async getUserProgress(userId) {
    const progress = await progressRepository.findByUserId(userId);
    const summary = await progressRepository.getUserSummary(userId);

    // Classifica cada tópico
    const classified = progress.map((item) => ({
      ...item,
      status: this._classifyPerformance(Number(item.accuracy_rate)),
    }));

    // Separa por categoria
    const mastered = classified.filter((p) => p.status === 'dominado');
    const needsWork = classified.filter((p) => p.status === 'reforcar');
    const inProgress = classified.filter((p) => p.status === 'em_progresso');

    return {
      summary: {
        total_correct: summary.total_correct || 0,
        total_wrong: summary.total_wrong || 0,
        total_answered: summary.total_answered || 0,
        topics_studied: summary.topics_studied || 0,
        overall_accuracy: summary.overall_accuracy || 0,
      },
      topics: classified,
      insights: { mastered, needs_work: needsWork, in_progress: inProgress },
    };
  }

  _classifyPerformance(accuracyRate) {
    if (accuracyRate >= 80) return 'dominado';
    if (accuracyRate >= 50) return 'em_progresso';
    return 'reforcar';
  }
}

module.exports = new ProgressService();
