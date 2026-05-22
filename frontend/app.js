// ── CONFIG ──────────────────────────────────
const API = "https://smart-study-platform-production.up.railway.app";
let token = localStorage.getItem("token");
let currentUser = null;

// Quiz state
let questions = [];
let currentQIndex = 0;
let quizScore = { correct: 0, wrong: 0 };
let answered = false;

// ── INIT ─────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (token) {
    initApp();
  } else {
    showScreen("auth");
  }
});

async function initApp() {
  try {
    const res = await apiFetch("/me");
    currentUser = res.data.user;
    showScreen("app");
    setUserUI(currentUser);
    loadHomeData();
  } catch {
    logout();
  }
}

// ── AUTH ─────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((t, i) => {
    t.classList.toggle(
      "active",
      (i === 0 && tab === "login") || (i === 1 && tab === "register"),
    );
  });
  document.getElementById("login-form").style.display =
    tab === "login" ? "block" : "none";
  document.getElementById("register-form").style.display =
    tab === "register" ? "block" : "none";
  hideAuthError();
}

async function handleLogin() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const btn = document.getElementById("btn-login");
  hideAuthError();

  if (!email || !password) return showAuthError("Preencha todos os campos");

  setLoading(btn, true);
  try {
    const res = await apiFetch("/login", "POST", { email, password }, false);
    token = res.data.token;
    currentUser = res.data.user;
    localStorage.setItem("token", token);
    showScreen("app");
    setUserUI(currentUser);
    loadHomeData();
  } catch (e) {
    showAuthError(e.message);
  } finally {
    setLoading(btn, false, "Entrar na plataforma");
  }
}

async function handleRegister() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const btn = document.getElementById("btn-register");
  hideAuthError();

  if (!name || !email || !password)
    return showAuthError("Preencha todos os campos");

  setLoading(btn, true);
  try {
    const res = await apiFetch(
      "/register",
      "POST",
      { name, email, password },
      false,
    );
    token = res.data.token;
    currentUser = res.data.user;
    localStorage.setItem("token", token);
    showScreen("app");
    setUserUI(currentUser);
    loadHomeData();
    showToast("Conta criada! Bons estudos! 🎯", "success");
  } catch (e) {
    showAuthError(e.message);
  } finally {
    setLoading(btn, false, "Criar minha conta");
  }
}

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem("token");
  showScreen("auth");
}

// ── APP VIEWS ────────────────────────────────
function showScreen(name) {
  document
    .getElementById("auth-screen")
    .classList.toggle("active", name === "auth");
  document
    .getElementById("app-screen")
    .classList.toggle("active", name === "app");
}

function showView(name) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document.getElementById("view-" + name).classList.add("active");
  document
    .querySelectorAll(".app-nav-btn")
    .forEach((b) => b.classList.remove("active"));
  const tab = document.getElementById("tab-" + name);
  if (tab) tab.classList.add("active");

  if (name === "progress") loadProgress();
  if (name === "subjects") loadSubjects();
}

function setUserUI(user) {
  document.getElementById("user-name-nav").textContent =
    user.name.split(" ")[0];
  document.getElementById("user-avatar").textContent =
    user.name[0].toUpperCase();
  document.getElementById("home-title").textContent =
    `Olá, ${user.name.split(" ")[0]} 👋`;
}

// ── HOME DATA ────────────────────────────────
async function loadHomeData() {
  loadProgress(true); // stats only
  loadSubjectsInto("home-subjects");
}

async function loadSubjects() {
  loadSubjectsInto("subjects-grid");
}

async function loadSubjectsInto(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML =
    '<div class="empty-state"><div class="loader"></div></div>';
  try {
    const res = await apiFetch("/subjects");
    renderSubjects(res.data, container);
  } catch {
    container.innerHTML =
      '<div class="empty-state"><p>Erro ao carregar matérias.</p></div>';
  }
}

function renderSubjects(subjects, container) {
  if (!subjects.length) {
    container.innerHTML =
      '<div class="empty-state"><div class="empty-icon">📭</div><h3>Sem matérias</h3></div>';
    return;
  }
  container.innerHTML = subjects
    .map(
      (s) => `
        <div class="subject-card" onclick="loadTopics(${s.id}, '${escHtml(s.name)}', '${escHtml(s.icon || "📖")}')">
          <div class="subject-icon">${s.icon || "📖"}</div>
          <div class="subject-name">${escHtml(s.name)}</div>
          <div class="subject-count">${s.topic_count} tópico${s.topic_count !== 1 ? "s" : ""}</div>
        </div>
      `,
    )
    .join("");
}

// ── TOPICS ───────────────────────────────────
async function loadTopics(subjectId, subjectName, icon) {
  showView("topics");
  document.getElementById("topics-title").textContent =
    `${icon} ${subjectName}`;
  const list = document.getElementById("topics-list");
  list.innerHTML = '<div class="empty-state"><div class="loader"></div></div>';

  try {
    const res = await apiFetch(`/subjects/${subjectId}/topics`);
    renderTopics(res.data.topics);
  } catch {
    list.innerHTML =
      '<div class="empty-state"><p>Erro ao carregar tópicos.</p></div>';
  }
}

function renderTopics(topics) {
  const list = document.getElementById("topics-list");
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  if (!topics.length) {
    list.innerHTML =
      '<div class="empty-state"><div class="empty-icon">📭</div><h3>Sem tópicos</h3><p>Esta matéria ainda não tem conteúdos.</p></div>';
    return;
  }
  list.innerHTML = topics
    .map(
      (t, i) => `
        <div class="topic-item" onclick="startQuiz(${t.id}, '${escHtml(t.name)}')">
          <div class="topic-item-left">
            <div class="topic-number">${letters[i] || i + 1}</div>
            <div>
              <div class="topic-name">${escHtml(t.name)}</div>
              <div class="topic-qcount">${t.question_count} questão${t.question_count !== 1 ? "ões" : ""}</div>
            </div>
          </div>
          <div class="topic-arrow">›</div>
        </div>
      `,
    )
    .join("");
}

// ── QUIZ ─────────────────────────────────────
async function startQuiz(topicId, topicName) {
  showView("quiz");
  document.getElementById("answers-list").innerHTML =
    '<div style="text-align:center;padding:40px"><div class="loader"></div></div>';

  try {
    const res = await apiFetch(`/topics/${topicId}/questions`);
    questions = res.data;
    currentQIndex = 0;
    quizScore = { correct: 0, wrong: 0 };

    if (!questions.length) {
      document.getElementById("answers-list").innerHTML = "";
      document.getElementById("q-statement").textContent =
        "Nenhuma questão disponível para este tópico ainda.";
      return;
    }
    renderQuestion();
  } catch {
    showToast("Erro ao carregar questões", "error");
    showView("topics");
  }
}

function renderQuestion() {
  answered = false;
  const q = questions[currentQIndex];
  const total = questions.length;
  const letters = ["A", "B", "C", "D", "E"];

  // Header
  document.getElementById("quiz-meta").textContent =
    `Questão ${currentQIndex + 1} de ${total}`;
  document.getElementById("quiz-progress-fill").style.width =
    `${(currentQIndex / total) * 100}%`;
  document.getElementById("quiz-score-live").textContent =
    `✅ ${quizScore.correct}  ❌ ${quizScore.wrong}`;

  // Question
  const diffMap = {
    facil: "diff-facil",
    medio: "diff-medio",
    dificil: "diff-dificil",
  };
  const diffLabel = { facil: "Fácil", medio: "Médio", dificil: "Difícil" };
  document.getElementById("q-difficulty").className =
    `question-difficulty ${diffMap[q.difficulty] || "diff-medio"}`;
  document.getElementById("q-difficulty").textContent =
    diffLabel[q.difficulty] || "Médio";
  document.getElementById("q-statement").textContent = q.statement;

  // Answers
  const answersEl = document.getElementById("answers-list");
  answersEl.innerHTML = q.answers
    .map(
      (a, i) => `
        <button class="answer-btn" onclick="submitAnswer(${q.id}, ${a.id}, this)" data-answer-id="${a.id}">
          <span class="answer-letter">${letters[i]}</span>
          <span>${escHtml(a.text)}</span>
        </button>
      `,
    )
    .join("");

  // Feedback & next btn
  const fb = document.getElementById("feedback-card");
  fb.className = "feedback-card";
  fb.classList.remove("visible");
  document.getElementById("btn-next").classList.remove("visible");
}

async function submitAnswer(questionId, answerId, btnEl) {
  if (answered) return;
  answered = true;

  // Disable all buttons
  document.querySelectorAll(".answer-btn").forEach((b) => (b.disabled = true));

  try {
    const res = await apiFetch("/answers", "POST", {
      question_id: questionId,
      answer_id: answerId,
    });
    const { is_correct, correct_answer_id, explanation } = res.data;

    // Mark selected
    btnEl.classList.add(is_correct ? "correct" : "incorrect");
    btnEl.querySelector(".answer-letter").style.background = is_correct
      ? "var(--green)"
      : "var(--red)";
    btnEl.querySelector(".answer-letter").style.color = "#fff";

    // If wrong, highlight correct
    if (!is_correct) {
      document.querySelectorAll(".answer-btn").forEach((b) => {
        if (parseInt(b.dataset.answerId) === correct_answer_id) {
          b.classList.add("reveal-correct");
        }
      });
    }

    // Update score
    if (is_correct) quizScore.correct++;
    else quizScore.wrong++;
    document.getElementById("quiz-score-live").textContent =
      `✅ ${quizScore.correct}  ❌ ${quizScore.wrong}`;

    // Feedback
    const fb = document.getElementById("feedback-card");
    fb.classList.add(is_correct ? "correct" : "incorrect", "visible");
    document.getElementById("feedback-title").textContent = is_correct
      ? "✅ Resposta correta!"
      : "❌ Resposta incorreta";
    document.getElementById("feedback-body").textContent =
      explanation ||
      (is_correct
        ? "Parabéns! Continue assim."
        : "Não desista, tente os próximos!");

    // Show next btn
    const btnNext = document.getElementById("btn-next");
    btnNext.classList.add("visible");
    if (currentQIndex === questions.length - 1) {
      btnNext.textContent = "Ver resultado ✓";
    } else {
      btnNext.textContent = "Próxima →";
    }
  } catch (e) {
    showToast("Erro ao registrar resposta", "error");
    answered = false;
    document
      .querySelectorAll(".answer-btn")
      .forEach((b) => (b.disabled = false));
  }
}

function nextQuestion() {
  currentQIndex++;
  if (currentQIndex >= questions.length) {
    showQuizResult();
  } else {
    renderQuestion();
  }
}

function showQuizResult() {
  const total = questions.length;
  const accuracy = Math.round((quizScore.correct / total) * 100);
  const emoji = accuracy >= 80 ? "🏆" : accuracy >= 50 ? "💪" : "📖";
  const msg =
    accuracy >= 80
      ? "Você domina este conteúdo!"
      : accuracy >= 50
        ? "Bom progresso! Continue praticando."
        : "Precisa reforçar este assunto.";

  document.getElementById("view-quiz").innerHTML = `
        <div style="text-align:center;padding:60px 24px">
          <div style="font-size:64px;margin-bottom:20px">${emoji}</div>
          <h2 style="font-family:var(--font-display);font-size:32px;font-weight:800;margin-bottom:8px">${accuracy}% de acerto</h2>
          <p style="color:var(--muted);margin-bottom:8px">${quizScore.correct} de ${total} questões corretas</p>
          <p style="color:var(--accent);font-weight:600;margin-bottom:36px">${msg}</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <button class="btn-secondary" onclick="showView('subjects')">Estudar outra matéria</button>
            <button class="btn-primary" style="width:auto;padding:12px 24px" onclick="showView('progress')">Ver meu progresso</button>
          </div>
        </div>
      `;
}

function confirmExitQuiz() {
  if (answered || currentQIndex === 0) {
    showView("topics");
  } else if (confirm("Sair do quiz? Seu progresso parcial será salvo.")) {
    showView("topics");
  }
}

// ── PROGRESS ─────────────────────────────────
async function loadProgress(statsOnly = false) {
  try {
    const res = await apiFetch("/progress");
    const { summary, topics } = res.data;

    // Stats
    document.getElementById("stat-answered").textContent =
      summary.total_answered ?? 0;
    document.getElementById("stat-correct").textContent =
      summary.total_correct ?? 0;
    document.getElementById("stat-accuracy").textContent =
      (summary.overall_accuracy ?? 0) + "%";
    document.getElementById("stat-topics").textContent =
      summary.topics_studied ?? 0;

    if (statsOnly) return;

    const container = document.getElementById("progress-container");
    if (!topics.length) {
      container.innerHTML = `
            <div class="empty-state">
              <div class="empty-icon">📊</div>
              <h3>Sem dados ainda</h3>
              <p>Responda questões para ver seu progresso aqui.</p>
            </div>`;
      return;
    }

    container.innerHTML = `<div class="progress-grid">${topics
      .map((p) => {
        const acc = p.accuracy_rate ?? 0;
        const total = (p.correct_count || 0) + (p.wrong_count || 0);
        const statusLabel = {
          dominado: "Dominado",
          reforcar: "Reforçar",
          em_progresso: "Em progresso",
        };
        const color =
          p.status === "dominado"
            ? "var(--green)"
            : p.status === "reforcar"
              ? "var(--red)"
              : "var(--yellow)";
        return `
            <div class="progress-card">
              <div class="progress-card-header">
                <div>
                  <div class="progress-topic">${escHtml(p.topic_name)}</div>
                  <div class="progress-subject">${escHtml(p.subject_icon || "")} ${escHtml(p.subject_name)}</div>
                </div>
                <span class="progress-badge badge-${p.status}">${statusLabel[p.status] || p.status}</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" style="width:${acc}%;background:${color}"></div>
              </div>
              <div class="progress-stats">
                <div class="progress-stat"><strong>${acc}%</strong> acerto</div>
                <div class="progress-stat"><strong>${p.correct_count}</strong> certas</div>
                <div class="progress-stat"><strong>${p.wrong_count}</strong> erradas</div>
                <div class="progress-stat"><strong>${total}</strong> total</div>
              </div>
            </div>
          `;
      })
      .join("")}</div>`;
  } catch {
    // silently fail for stats
  }
}

// ── API FETCH ─────────────────────────────────
async function apiFetch(path, method = "GET", body = null, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth && token) headers["Authorization"] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(API + path, opts);
  const data = await res.json();

  if (!data.success) throw new Error(data.message || "Erro na requisição");
  return data;
}

// ── HELPERS ───────────────────────────────────
function showAuthError(msg) {
  const el = document.getElementById("auth-error");
  el.textContent = msg;
  el.style.display = "block";
}
function hideAuthError() {
  document.getElementById("auth-error").style.display = "none";
}

function setLoading(btn, loading, label) {
  if (loading) {
    btn.innerHTML = '<span class="loader"></span>';
    btn.disabled = true;
  } else {
    btn.textContent = label;
    btn.disabled = false;
  }
}

let toastTimer;
function showToast(msg, type = "") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Enter key for auth
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const loginVisible =
      document.getElementById("login-form").style.display !== "none";
    if (document.getElementById("auth-screen").classList.contains("active")) {
      loginVisible ? handleLogin() : handleRegister();
    }
  }
});
