const KW_VERSION = "4.1.0";
const USER = { username: "Aluno", UID: Date.now() % 1000000 };

/* Configurações Globais */
const SETTINGS = {
    autoComplete: false,
    darkMode: false,
    showAnswers: false,
    autoAnswer: true,
    answerDelay: 0,
    customStyle: true,
    mobileMenuOpen: false
};

/* Elementos da UI */
const KW_UI = {
    menu: document.createElement('div'),
    toggle: document.createElement('div'),
    mobileMenu: document.createElement('div'),
    status: document.createElement('div'),
    init() {
        this.createMainMenu();
        this.createMobileMenu();
        this.createStatus();
        this.applyStyles();
        this.bindEvents();
    },

    createMainMenu() {
        Object.assign(this.menu.style, {
            position: 'fixed',
            top: '60px',
            right: '20px',
            background: 'rgba(0,0,0,0.95)',
            borderRadius: '12px',
            padding: '15px',
            width: '250px',
            display: 'none',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        });

        this.menu.innerHTML = `
            <div style="margin-bottom:15px;font-size:1.2em;border-bottom:1px solid #333;padding-bottom:8px">
                🛠️ Configurações KHANWARE
            </div>
            ${this.generateMenuItems()}
            <div style="margin-top:15px;font-size:0.8em;color:#888">
                <div>👤 ${USER.username}</div>
                <div>🆔 UID: ${USER.UID}</div>
                <div>🚀 Versão: ${KW_VERSION}</div>
            </div>
        `;
        document.body.appendChild(this.menu);
    },

    generateMenuItems() {
        const features = [
            { icon: '📝', label: 'Auto-Completar', key: 'F1', setting: 'autoComplete' },
            { icon: '🤖', label: 'Auto-Resposta', key: 'F2', setting: 'autoAnswer' },
            { icon: '👁️', label: 'Mostrar Respostas', key: 'F3', setting: 'showAnswers' },
            { icon: '🌙', label: 'Modo Escuro', key: 'F4', setting: 'darkMode' },
            { icon: '⚡', label: 'Delay Respostas', key: 'F5', type: 'range', setting: 'answerDelay', min: 0, max: 5 }
        ];

        return features.map(item => `
            <div class="menu-item" data-setting="${item.setting}" 
                 style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);cursor:pointer">
                <div style="display:flex;align-items:center;gap:12px">
                    <span style="font-size:1.1em">${item.icon}</span>
                    <div style="flex-grow:1">
                        <div>${item.label}</div>
                        ${item.type === 'range' ? `
                            <input type="range" min="${item.min}" max="${item.max}" 
                                   value="${SETTINGS[item.setting]}" 
                                   style="width:100%;margin-top:4px">
                        ` : `
                            <div style="font-size:0.8em;color:#888">Atalho: ${item.key}</div>
                        `}
                    </div>
                    ${item.type !== 'range' ? `
                        <label class="switch">
                            <input type="checkbox" ${SETTINGS[item.setting] ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    createMobileMenu() {
        Object.assign(this.mobileMenu.style, {
            position: 'fixed',
            bottom: '-100%',
            left: '0',
            right: '0',
            background: 'rgba(0,0,0,0.95)',
            padding: '20px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            transition: 'bottom 0.3s ease',
            zIndex: 10000,
            backdropFilter: 'blur(10px)'
        });

        this.mobileMenu.innerHTML = `
            <div style="text-align:center;margin-bottom:15px;font-size:1.2em">
                🛠️ Menu KHANWARE
            </div>
            ${this.generateMobileItems()}
        `;
        document.body.appendChild(this.mobileMenu);
    },

    generateMobileItems() {
        const features = [
            { icon: '📝', label: 'Auto-Completar', setting: 'autoComplete' },
            { icon: '🤖', label: 'Auto-Resposta', setting: 'autoAnswer' },
            { icon: '👁️', label: 'Mostrar Respostas', setting: 'showAnswers' },
            { icon: '🌙', label: 'Modo Escuro', setting: 'darkMode' }
        ];

        return features.map(item => `
            <div class="mobile-item" data-setting="${item.setting}" 
                 style="padding:15px;background:rgba(255,255,255,0.1);border-radius:12px;margin-bottom:10px">
                <div style="display:flex;align-items:center;gap:15px">
                    <span style="font-size:1.3em">${item.icon}</span>
                    <div style="flex-grow:1;font-size:1.1em">${item.label}</div>
                    <label class="switch">
                        <input type="checkbox" ${SETTINGS[item.setting] ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `).join('');
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
            fontSize: '0.9em',
            backdropFilter: 'blur(4px)',
            zIndex: 9999
        });

        const updateStatus = () => {
            const time = new Date().toLocaleTimeString();
            this.status.innerHTML = `🕒 ${time} | ✅ Atividades: ${document.querySelectorAll('.practice-question').length}`;
        };

        setInterval(updateStatus, 1000);
        updateStatus();
        document.body.appendChild(this.status);
    },

    applyStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 20px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #666;
                transition: .3s;
                border-radius: 20px;
            }

            .slider:before {
                content: "";
                position: absolute;
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: #72ff72;
            }

            input:checked + .slider:before {
                transform: translateX(20px);
            }

            @media (max-width: 768px) {
                .menu-item {
                    padding: 12px 0 !important;
                }
            }
        `;
        document.head.appendChild(style);
    },

    bindEvents() {
        // Alternar menus
        document.addEventListener('click', (e) => {
            if(e.target.closest('.menu-toggle')) {
                if(device.mobile) {
                    this.toggleMobileMenu();
                } else {
                    this.menu.style.display = this.menu.style.display === 'block' ? 'none' : 'block';
                }
            }
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if(!e.target.closest('.menu') && !e.target.closest('.menu-toggle')) {
                this.menu.style.display = 'none';
                if(device.mobile) this.closeMobileMenu();
            }
        });

        // Eventos de configuração
        document.querySelectorAll('.menu-item input, .mobile-item input').forEach(input => {
            input.addEventListener('change', (e) => {
                const setting = e.target.closest('[data-setting]').dataset.setting;
                SETTINGS[setting] = e.target.checked;
                this.updateFeature(setting, e.target.checked);
            });
        });

        // Eventos de range
        document.querySelectorAll('input[type="range"]').forEach(input => {
            input.addEventListener('input', (e) => {
                SETTINGS.answerDelay = e.target.value;
            });
        });
    },

    toggleMobileMenu() {
        SETTINGS.mobileMenuOpen = !SETTINGS.mobileMenuOpen;
        this.mobileMenu.style.bottom = SETTINGS.mobileMenuOpen ? '0' : '-100%';
    },

    closeMobileMenu() {
        SETTINGS.mobileMenuOpen = false;
        this.mobileMenu.style.bottom = '-100%';
    },

    updateFeature(setting, value) {
        switch(setting) {
            case 'darkMode':
                document.body.style.backgroundColor = value ? '#1a1a1a' : '';
                document.body.style.color = value ? '#fff' : '';
                break;
            case 'autoAnswer':
                if(value) this.activateAutoAnswer();
                break;
        }
    },

    activateAutoAnswer() {
        const answerQuestions = () => {
            document.querySelectorAll('.perseus-radio-option, .perseus-checkbox').forEach(btn => {
                if(!btn.dataset.answered) {
                    btn.click();
                    btn.dataset.answered = true;
                }
            });
        };

        if(SETTINGS.answerDelay > 0) {
            setTimeout(answerQuestions, SETTINGS.answerDelay * 1000);
        } else {
            answerQuestions();
        }
    }
};

/* Sistema de Atalhos */
const ShortcutManager = {
    init() {
        document.addEventListener('keydown', (e) => {
            if(e.key === 'F1') this.toggleSetting('autoComplete');
            if(e.key === 'F2') this.toggleSetting('autoAnswer');
            if(e.key === 'F3') this.toggleSetting('showAnswers');
            if(e.key === 'F4') this.toggleSetting('darkMode');
        });
    },

    toggleSetting(setting) {
        SETTINGS[setting] = !SETTINGS[setting];
        document.querySelectorAll(`[data-setting="${setting}"] input`).forEach(input => {
            input.checked = SETTINGS[setting];
        });
        KW_UI.updateFeature(setting, SETTINGS[setting]);
    }
};

/* Sistema de Auto-Completar */
const AutoCompleteSystem = {
    init() {
        document.addEventListener('keydown', (e) => {
            if(e.key === 'F1' || (device.mobile && SETTINGS.autoComplete)) {
                this.completeAllActivities();
            }
        });
    },

    completeAllActivities() {
        document.querySelectorAll('.practice-question').forEach(question => {
            const inputs = question.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.value = 'Resposta Automática';
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
            
            const submitBtn = question.querySelector('.submit-btn');
            if(submitBtn) {
                submitBtn.click();
                question.style.opacity = '0.5';
            }
        });
    }
};

/* Inicialização */
KW_UI.init();
ShortcutManager.init();
AutoCompleteSystem.init();

/* Suporte Mobile */
if(device.mobile) {
    document.body.addEventListener('touchstart', (e) => {
        if(e.touches.length === 3) {
            KW_UI.toggleMobileMenu();
        }
    });
}

/* Feedback Inicial */
KW_UI.status.innerHTML += `<div style="margin-top:5px;color:#72ff72">✅ Pronto! Use os atalhos F1-F5</div>`;
setTimeout(() => {
    KW_UI.status.querySelector('div').remove();
}, 3000);
