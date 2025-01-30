const KW_VERSION = "4.0.0";
const USER = { username: "Aluno", UID: Date.now() % 1000000 };

/* Configurações Globais */
const SETTINGS = {
  autoComplete: false,
  darkMode: false,
  showAnswers: false,
  autoAnswer: true,
  answerDelay: 0,
  customStyle: true
};

/* Elementos da UI */
const KW_UI = {
  menu: document.createElement('div'),
  toggle: document.createElement('div'),
  status: document.createElement('div'),
  init() {
    this.createMenu();
    this.createToggle();
    this.createStatus();
    this.applyStyles();
    this.bindEvents();
  },

  createMenu() {
    Object.assign(this.menu.style, {
      position: 'fixed',
      top: '60px',
      right: '20px',
      background: 'rgba(0,0,0,0.9)',
      borderRadius: '12px',
      padding: '15px',
      width: '250px',
      display: 'none',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    });

    this.menu.innerHTML = `
      <div style="margin-bottom:15px;font-size:1.2em">🔧 Configurações KHANWARE</div>
      ${Object.entries(SETTINGS).map(([key, val]) => `
        <label style="display:flex;align-items:center;gap:10px;margin:8px 0;cursor:pointer;">
          <input type="checkbox" ${val ? 'checked' : ''} data-setting="${key}">
          ${this.formatLabel(key)}
        </label>
      `).join('')}
      <hr style="margin:15px 0;border-color:#333">
      <div style="font-size:0.9em;color:#888">
        👤 ${USER.username} | UID: ${USER.UID}<br>
        🚀 Versão: ${KW_VERSION}
      </div>
    `;
    document.body.appendChild(this.menu);
  },

  formatLabel(key) {
    const labels = {
      autoComplete: 'Completar Automaticamente',
      darkMode: 'Modo Escuro',
      showAnswers: 'Mostrar Respostas',
      autoAnswer: 'Auto-Resposta',
      customStyle: 'Estilo Personalizado'
    };
    return labels[key] || key;
  },

  createToggle() {
    Object.assign(this.toggle.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#000',
      color: '#0f0',
      padding: '10px 20px',
      borderRadius: '25px',
      cursor: 'pointer',
      zIndex: 9999,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    });
    this.toggle.innerHTML = 'KHANWARE 🔓';
    document.body.appendChild(this.toggle);
  },

  createStatus() {
    Object.assign(this.status.style, {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'rgba(0,0,0,0.7)',
      color: '#fff',
      padding: '8px 15px',
      borderRadius: '20px',
      fontSize: '0.9em'
    });
    this.updateStatus();
    document.body.appendChild(this.status);
  },

  updateStatus() {
    const time = new Date().toLocaleTimeString();
    this.status.innerHTML = `🕒 ${time} | ✅ Atividades: ${document.querySelectorAll('.practice-question').length}`;
  },

  applyStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      input[type="checkbox"] {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid #666;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
      }
      input[type="checkbox"]:checked {
        background: #0f0;
        border-color: #0f0;
      }
      input[type="checkbox"]:checked::after {
        content: '✓';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #000;
      }
    `;
    document.head.appendChild(style);
  },

  bindEvents() {
    this.toggle.addEventListener('click', () => {
      this.menu.style.display = this.menu.style.display === 'block' ? 'none' : 'block';
    });

    this.menu.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', (e) => {
        SETTINGS[e.target.dataset.setting] = e.target.checked;
        if(e.target.dataset.setting === 'darkMode') this.toggleDarkMode();
      });
    });
  },

  toggleDarkMode() {
    if(SETTINGS.darkMode) {
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#fff';
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  }
};

/* Sistema de Auto-Resposta */
const AnswerSystem = {
  async processQuestions() {
    if(!SETTINGS.autoAnswer && !SETTINGS.autoComplete) return;
    
    const questions = document.querySelectorAll('.practice-question, .perseus-renderer');
    for(const question of questions) {
      if(SETTINGS.autoComplete) {
        this.completeQuestion(question);
      } else if(SETTINGS.autoAnswer) {
        this.answerQuestion(question);
      }
      await new Promise(resolve => setTimeout(resolve, SETTINGS.answerDelay * 1000));
    }
  },

  answerQuestion(question) {
    const answer = question.querySelector('.perseus-radio-option, .perseus-checkbox');
    if(answer) {
      answer.click();
      this.showFeedback('Resposta selecionada!');
    }
  },

  completeQuestion(question) {
    const inputs = question.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.value = 'Resposta Automática';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    const submitBtn = question.querySelector('.submit-btn');
    if(submitBtn) {
      submitBtn.click();
      this.showFeedback('Atividade concluída!');
    }
  },

  showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.style = `
      position: fixed;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: #0f0;
      color: #000;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: bold;
      z-index: 9999;
    `;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
  }
};

/* Inicialização */
KW_UI.init();
setInterval(() => KW_UI.updateStatus(), 1000);

new MutationObserver(() => {
  AnswerSystem.processQuestions();
  if(SETTINGS.showAnswers) {
    document.querySelectorAll('.perseus-answer').forEach(el => 
      el.style.display = 'block'
    );
  }
}).observe(document.body, { childList: true, subtree: true });

/* Ativação Rápida */
document.addEventListener('keydown', (e) => {
  if(e.key === 'F1') SETTINGS.autoComplete = !SETTINGS.autoComplete;
  if(e.key === 'F2') SETTINGS.autoAnswer = !SETTINGS.autoAnswer;
});
