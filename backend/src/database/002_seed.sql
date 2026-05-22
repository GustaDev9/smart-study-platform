-- ============================================
-- ENEM Study Platform - Seed de Dados
-- ============================================

USE enem_study_platform;

-- Matérias
INSERT INTO subjects (name, icon, color) VALUES
('Matemática', '📐', '#3B82F6'),
('Língua Portuguesa', '📚', '#8B5CF6'),
('Física', '⚡', '#F59E0B'),
('Química', '🧪', '#10B981'),
('Biologia', '🧬', '#EF4444'),
('História', '🏛️', '#6B7280'),
('Geografia', '🌍', '#0EA5E9'),
('Redação', '✍️', '#F97316');

-- Tópicos de Matemática
INSERT INTO topics (subject_id, name, description) VALUES
(1, 'Função do 1º Grau', 'Estudo das funções lineares e suas aplicações'),
(1, 'Função do 2º Grau', 'Parábolas, vértice, raízes e discriminante'),
(1, 'Trigonometria', 'Seno, cosseno, tangente e relações trigonométricas'),
(1, 'Geometria Plana', 'Áreas e perímetros de figuras planas'),
(1, 'Progressão Aritmética', 'PA: termo geral e soma dos termos'),
(1, 'Progressão Geométrica', 'PG: termo geral, soma e aplicações');

-- Tópicos de Física
INSERT INTO topics (subject_id, name, description) VALUES
(3, 'Cinemática', 'Movimento uniforme e uniformemente variado'),
(3, 'Dinâmica', 'Leis de Newton e aplicações'),
(3, 'Óptica Geométrica', 'Reflexão, refração e lentes'),
(3, 'Termodinâmica', 'Calor, temperatura e leis da termodinâmica');

-- Tópicos de Português
INSERT INTO topics (subject_id, name, description) VALUES
(2, 'Interpretação de Texto', 'Compreensão e análise de textos variados'),
(2, 'Gramática', 'Morfologia, sintaxe e concordância'),
(2, 'Literatura Brasileira', 'Principais movimentos e autores da literatura');

-- Questões de Função do 2º Grau (topic_id = 2)
INSERT INTO questions (topic_id, statement, difficulty, explanation) VALUES
(2, 'Uma função quadrática é definida por f(x) = x² - 5x + 6. Quais são as raízes dessa função?', 'medio', 'Usando a fórmula de Bhaskara ou fatoração: (x-2)(x-3) = 0, logo x=2 e x=3'),
(2, 'O vértice da parábola f(x) = x² - 4x + 5 tem coordenadas:', 'medio', 'Xv = -b/2a = 4/2 = 2. Yv = f(2) = 4-8+5 = 1. Vértice: (2,1)'),
(2, 'Uma função f(x) = ax² + bx + c tem discriminante Δ = 0. Isso significa que:', 'facil', 'Quando Δ=0, a função tem uma única raiz real (raiz dupla)');

-- Alternativas Q1 (id=1)
INSERT INTO answers (question_id, text, is_correct) VALUES
(1, 'x = 1 e x = 6', 0),
(1, 'x = 2 e x = 3', 1),
(1, 'x = -2 e x = -3', 0),
(1, 'x = 1 e x = -6', 0),
(1, 'A função não tem raízes reais', 0);

-- Alternativas Q2 (id=2)
INSERT INTO answers (question_id, text, is_correct) VALUES
(2, '(4, 1)', 0),
(2, '(2, 5)', 0),
(2, '(2, 1)', 1),
(2, '(-2, 1)', 0),
(2, '(1, 2)', 0);

-- Alternativas Q3 (id=3)
INSERT INTO answers (question_id, text, is_correct) VALUES
(3, 'A função não possui raízes reais', 0),
(3, 'A função possui duas raízes reais distintas', 0),
(3, 'A função possui uma única raiz real (raiz dupla)', 1),
(3, 'A função possui três raízes reais', 0),
(3, 'Não é possível determinar', 0);

-- Questões de Cinemática (topic_id = 7)
INSERT INTO questions (topic_id, statement, difficulty, explanation) VALUES
(7, 'Um carro parte do repouso e acelera uniformemente a 2 m/s². Qual será sua velocidade após 5 segundos?', 'facil', 'Usando v = v0 + at: v = 0 + 2×5 = 10 m/s'),
(7, 'Um objeto em MRU percorre 120m em 4 segundos. Qual é sua velocidade?', 'facil', 'v = Δs/Δt = 120/4 = 30 m/s'),
(7, 'Um projétil é lançado verticalmente para cima com velocidade de 20 m/s. Considerando g=10m/s², qual é a altura máxima atingida?', 'medio', 'Na altura máxima v=0. Usando v² = v0² - 2gh: 0 = 400 - 20h → h = 20m');

-- Alternativas Q4 (id=4)
INSERT INTO answers (question_id, text, is_correct) VALUES
(4, '5 m/s', 0),
(4, '7 m/s', 0),
(4, '10 m/s', 1),
(4, '12 m/s', 0),
(4, '2.5 m/s', 0);

-- Alternativas Q5 (id=5)
INSERT INTO answers (question_id, text, is_correct) VALUES
(5, '15 m/s', 0),
(5, '20 m/s', 0),
(5, '25 m/s', 0),
(5, '30 m/s', 1),
(5, '480 m/s', 0);

-- Alternativas Q6 (id=6)
INSERT INTO answers (question_id, text, is_correct) VALUES
(6, '10 m', 0),
(6, '15 m', 0),
(6, '20 m', 1),
(6, '40 m', 0),
(6, '4 m', 0);
