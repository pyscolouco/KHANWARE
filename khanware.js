const ver = "V3.1.0";

const device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

/* User Configuration */
const user = {
    username: "Username",
    nickname: "Nickname",
    UID: 0
};

/* Global State Management */
const state = {
    features: {
        questionSpoof: true,
        videoSpoof: true,
        showAnswers: false,
        autoAnswer: false,
        customBanner: false,
        nextRecommendation: false,
        repeatQuestion: false,
        minuteFarmer: false,
        rgbLogo: false,
        darkMode: false,
        onekoJs: false
    },
    configs: {
        autoAnswerDelay: 3,
        customUsername: "",
        customPfp: ""
    },
    loadedPlugins: []
};

/* UI Elements */
const elements = {
    unloader: document.createElement('div'),
    dropdownMenu: document.createElement('div'),
    watermark: document.createElement('div'),
    statsPanel: document.createElement('div'),
    splashScreen: document.createElement('div')
};

/* Security Enhancements */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','C','J'].includes(e.key))) {
        e.preventDefault();
    }
});

/* Style Injections */
const injectStyles = () => {
    const styles = [
        `@font-face{font-family:'MuseoSans';src:url('https://corsproxy.io/?url=https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}`,
        `::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#888;border-radius:10px}::-webkit-scrollbar-thumb:hover{background:#555}`,
        `.kw-menu-item{padding:8px;transition:all 0.2s ease}.kw-menu-item:hover{background:rgba(255,255,255,0.1)}`
    ];

    styles.forEach(style => {
        document.head.appendChild(Object.assign(document.createElement('style'), {innerHTML: style}));
    });
    
    document.querySelector("link[rel~='icon']").href = 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';
};

/* Event System */
class EventEmitter {
    constructor() { this.events = {}; }
    on(events, callback) {
        events.split(',').forEach(event => {
            this.events[event] = this.events[event] || [];
            this.events[event].push(callback);
        });
    }
    emit(event, ...args) {
        (this.events[event] || []).forEach(callback => callback(...args));
    }
}

const eventBus = new EventEmitter();
new MutationObserver(() => eventBus.emit('domChanged'))
    .observe(document.body, { childList: true, subtree: true });

/* Utility Functions */
const utilities = {
    delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
    playSound: url => new Audio(url).play().catch(() => {}),
    safeFetch: async url => {
        try {
            const start = performance.now();
            await fetch(url, { method: 'HEAD' });
            return Math.round(performance.now() - start);
        } catch {
            return 'Error';
        }
    }
};

/* Toast System */
const showToast = (text, duration = 3000) => {
    Toastify({
        text,
        duration,
        gravity: 'bottom',
        position: 'center',
        style: {
            background: 'rgba(0,0,0,0.8)',
            borderRadius: '8px',
            backdropFilter: 'blur(4px)'
        }
    }).showToast();
};

/* Splash Screen */
const splashScreen = {
    show: async () => {
        elements.splashScreen.style.cssText = `
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:#000;display:flex;align-items:center;justify-content:center;
            z-index:9999;opacity:0;transition:opacity 0.5s;user-select:none;
            font-family:MuseoSans,sans-serif;font-size:2rem;color:#fff;
        `;
        elements.splashScreen.innerHTML = `
            <div style="text-align:center">
                <div style="font-size:3em;margin-bottom:20px">
                    <span style="color:#72ff72">KHAN</span><span>WARE</span>
                </div>
                <div style="font-size:0.8em;color:#888">Loading educational tools...</div>
            </div>
        `;
        document.body.appendChild(elements.splashScreen);
        await utilities.delay(50);
        elements.splashScreen.style.opacity = '1';
    },
    hide: async () => {
        elements.splashScreen.style.opacity = '0';
        await utilities.delay(1000);
        elements.splashScreen.remove();
    }
};

/* Menu System */
const menuSystem = {
    init() {
        this.createWatermark();
        this.createDropdown();
        this.createStatsPanel();
        this.loadWidgetBot();
    },

    createWatermark() {
        Object.assign(elements.watermark.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '24px',
            fontFamily: 'MuseoSans, sans-serif',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            transition: 'transform 0.2s ease'
        });

        elements.watermark.innerHTML = `
            <span style="color:#72ff72">KW</span>
            <span style="font-size:0.8em">${ver}</span>
        `;

        elements.watermark.addEventListener('click', () => 
            elements.dropdownMenu.style.display = 
            elements.dropdownMenu.style.display === 'block' ? 'none' : 'block'
        );
        
        document.body.appendChild(elements.watermark);
    },

    createDropdown() {
        Object.assign(elements.dropdownMenu.style, {
            position: 'fixed',
            top: '60px',
            right: '20px',
            background: 'rgba(0,0,0,0.7)',
            borderRadius: '12px',
            padding: '12px',
            width: '240px',
            display: 'none',
            backdropFilter: 'blur(8px)',
            zIndex: 999
        });

        const features = [
            { label: 'Question Spoof', type: 'toggle', feature: 'questionSpoof' },
            { label: 'Auto Answer', type: 'toggle', feature: 'autoAnswer' },
            { label: 'Show Answers', type: 'toggle', feature: 'showAnswers' },
            { label: 'Dark Mode', type: 'toggle', feature: 'darkMode' },
            { type: 'divider' },
            { label: 'Custom Username', type: 'input', config: 'customUsername' },
            { label: 'Auto Answer Delay', type: 'range', config: 'autoAnswerDelay', min: 1, max: 5 }
        ];

        elements.dropdownMenu.innerHTML = features.map(item => {
            if (item.type === 'divider') return '<hr style="border-color:#333;margin:8px 0">';
            
            return `
                <div class="kw-menu-item">
                    ${this.createControl(item)}
                </div>
            `;
        }).join('');

        document.body.appendChild(elements.dropdownMenu);
    },

    createControl(item) {
        switch(item.type) {
            case 'toggle':
                return `
                    <label style="display:flex;align-items:center;gap:8px">
                        <input type="checkbox" ${state.features[item.feature] ? 'checked' : ''}
                            onchange="state.features.${item.feature} = this.checked">
                        ${item.label}
                    </label>
                `;
                
            case 'range':
                return `
                    <div style="display:flex;flex-direction:column;gap:4px">
                        <label>${item.label}</label>
                        <input type="range" min="${item.min}" max="${item.max}" 
                            value="${state.configs[item.config]}"
                            oninput="state.configs.${item.config} = this.value">
                    </div>
                `;
                
            case 'input':
                return `
                    <div style="display:flex;flex-direction:column;gap:4px">
                        <label>${item.label}</label>
                        <input type="text" value="${state.configs[item.config]}" 
                            oninput="state.configs.${item.config} = this.value">
                    </div>
                `;
        }
    },

    createStatsPanel() {
        Object.assign(elements.statsPanel.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '24px',
            fontFamily: 'MuseoSans, sans-serif',
            backdropFilter: 'blur(4px)',
            zIndex: 999
        });

        const updateStats = async () => {
            elements.statsPanel.innerHTML = `
                <span style="margin-right:12px">📶 ${await utilities.safeFetch('https://khanacademy.org')}ms</span>
                <span>🕒 ${new Date().toLocaleTimeString()}</span>
            `;
        };

        setInterval(updateStats, 1000);
        updateStats();
        document.body.appendChild(elements.statsPanel);
    },

    loadWidgetBot() {
        if(device.mobile) return;
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3';
        script.onload = () => {
            new Crate({
                server: '1286573512831533056',
                channel: '1286573601687867433',
                location: ['bottom', 'right'],
                notifications: false
            });
        };
        document.body.appendChild(script);
    }
};

/* Main Initialization */
(async () => {
    injectStyles();
    await splashScreen.show();
    
    // Load required dependencies
    await Promise.all([
        utilities.loadScript('https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js', 'darkreader'),
        utilities.loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastify')
    ]);
    
    menuSystem.init();
    await splashScreen.hide();
    
    // Example feature implementation
    eventBus.on('domChanged', () => {
        if(state.features.autoAnswer) {
            document.querySelectorAll('.practice-question').forEach(question => {
                if(!question.dataset.answered) {
                    question.click();
                    question.dataset.answered = true;
                }
            });
        }
    });
})();
