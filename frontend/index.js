const { Router } = require('express');
const authController = require('../controllers/authController');
const subjectController = require('../controllers/subjectController');
const questionController = require('../controllers/questionController');
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middlewares/auth');

const router = Router();

// ============================================
// AUTH
// ============================================
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', authMiddleware, (req, res) => authController.me(req, res));

// ============================================
// SUBJECTS (matérias)
// ============================================
router.get('/subjects', authMiddleware, (req, res) => subjectController.index(req, res));
router.get('/subjects/:id/topics', authMiddleware, (req, res) => subjectController.topics(req, res));

// ============================================
// TOPICS (questões de um tópico)
// ============================================
router.get('/topics/:id/questions', authMiddleware, (req, res) => questionController.byTopic(req, res));

// ============================================
// ANSWERS (enviar resposta)
// ============================================
router.post('/answers', authMiddleware, (req, res) => progressController.submitAnswer(req, res));

// ============================================
// PROGRESS (progresso do usuário)
// ============================================
router.get('/progress', authMiddleware, (req, res) => progressController.getProgress(req, res));

module.exports = router;
