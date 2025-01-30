const ver = "V3.0.3";

let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

/* User */
let user = {
    username: "Username",
    nickname: "Nickname",
    UID: 0
}

let loadedPlugins = [];

/* Elements */
const unloader = document.createElement('div');
const dropdownMenu = document.createElement('div');
const watermark = document.createElement('div');
const statsPanel = document.createElement('div');
const splashScreen = document.createElement('div');

/* Globals */
window.features = {
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: false,
    autoAnswer: false,
    customBanner: false,
    nextRecommendation: false,
    repeatQuestion: false,
    minuteFarmer: false,
    rgbLogo: false
};

window.featureConfigs = {
    autoAnswerDelay: 3,
    customUsername: "",
    customPfp: ""
};

/* Security */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','C','J'].includes(e.key))) e.preventDefault();
});

/* Styles */
document.head.appendChild(Object.assign(document.createElement("style"),{
    innerHTML: `@font-face{font-family:'MuseoSans';src:url('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ynddewua.ttf')format('truetype')}`
}));

document.head.appendChild(Object.assign(document.createElement('style'),{
    innerHTML: `::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#888;border-radius:10px}::-webkit-scrollbar-thumb:hover{background:#555}`
}));

document.querySelector("link[rel~='icon']").href = 'https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/ukh0rq22.png';

/* Event System */
class EventEmitter {
    constructor() { this.events = {}; }
    on(event, callback) {
        this.events[event] = this.events[event] || [];
        this.events[event].push(callback);
    }
    emit(event, ...args) {
        (this.events[event] || []).forEach(callback => callback(...args));
    }
}

const plppdo = new EventEmitter();
new MutationObserver(mutations => {
    mutations.some(m => m.type === 'childList') && plppdo.emit('domChanged');
}).observe(document.body, { childList: true, subtree: true });

/* Utilities */
const utilities = {
    delay: ms => new Promise(r => setTimeout(r, ms)),
    playSound: url => new Audio(url).play().catch(console.error),
    toast: (text, duration = 3000) => {
        Toastify({ text, duration, gravity: 'bottom', position: 'center',
            style: { background: 'rgba(0,0,0,0.9)', borderRadius: '8px' }
        }).showToast();
    }
};

/* Menu System */
function setupMenu() {
    const setFeature = (path, value) => {
        const parts = path.split('.');
        let obj = window;
        while(parts.length > 1) obj = obj[parts.shift()];
        obj[parts[0]] = value;
    };

    function createFeatureElement(attr) {
        const element = document.createElement(attr.type === 'nonInput' ? 'label' : 'input');
        if(attr.type !== 'nonInput') element.type = attr.type;
        
        if(attr.attributes) {
            attr.attributes.split(' ').forEach(a => {
                const [key, value] = a.split('=');
                element.setAttribute(key, value ? value.replace(/"/g, '') : '');
            });
        }
        
        if(attr.variable) element.setAttribute('data-setting', attr.variable);
        if(attr.className) element.classList.add(attr.className);
        
        return element;
    }

    function setupWatermark() {
        Object.assign(watermark.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.9)',
            color: '#fff',
            padding: '8px 15px',
            borderRadius: '20px',
            fontFamily: 'MuseoSans, sans-serif',
            fontSize: '14px',
            cursor: 'move',
            userSelect: 'none',
            zIndex: '1001',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        });
        
        watermark.innerHTML = `
            <span style="font-weight:bold">KHANWARE</span>
            <span style="color:#aaa; margin-left:8px">v${ver}</span>
        `;
        
        document.body.appendChild(watermark);
        
        let isDragging = false, offsetX, offsetY;
        watermark.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - watermark.offsetLeft;
            offsetY = e.clientY - watermark.offsetTop;
        });
        
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('mousemove', e => {
            if(isDragging) {
                watermark.style.left = `${Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - watermark.offsetWidth))}px`;
                watermark.style.top = `${Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - watermark.offsetHeight))}px`;
            }
        });
    }

    function setupDropdown() {
        Object.assign(dropdownMenu.style, {
            position: 'fixed',
            top: '50px',
            right: '10px',
            background: 'rgba(0,0,0,0.9)',
            color: '#fff',
            width: '200px',
            borderRadius: '12px',
            padding: '10px',
            display: 'none',
            zIndex: '1000',
            backdropFilter: 'blur(4px)'
        });

        const features = [
            { type: 'checkbox', label: 'Question Spoof', variable: 'features.questionSpoof', checked: true },
            { type: 'checkbox', label: 'Auto Answer', variable: 'features.autoAnswer' },
            { type: 'checkbox', label: 'Show Answers', variable: 'features.showAnswers' },
            { type: 'range', label: 'Answer Delay', variable: 'featureConfigs.autoAnswerDelay', min: 0, max: 5 },
            { type: 'divider' },
            { type: 'text', label: 'Custom Name', variable: 'featureConfigs.customUsername' },
            { type: 'text', label: 'Custom Avatar', variable: 'featureConfigs.customPfp' }
        ];

        dropdownMenu.innerHTML = features.map(f => {
            if(f.type === 'divider') return '<hr style="border-color:#333; margin:8px 0">';
            
            return `
                <div class="menu-item" style="margin:6px 0">
                    ${f.type !== 'checkbox' ? `<label>${f.label}</label>` : ''}
                    ${createFeatureElement({
                        type: f.type,
                        attributes: `${f.checked ? 'checked' : ''} ${f.min ? `min="${f.min}"` : ''} ${f.max ? `max="${f.max}"` : ''}`,
                        variable: f.variable
                    }).outerHTML}
                </div>
            `;
        }).join('');

        document.body.appendChild(dropdownMenu);
        
        watermark.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
    }

    function setupEventHandlers() {
        dropdownMenu.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', e => {
                const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                setFeature(e.target.getAttribute('data-setting'), value);
                utilities.playSound('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/5os0bypi.wav');
            });
        });
    }

    setupWatermark();
    setupDropdown();
    setupEventHandlers();
}

/* Main Functions */
function setupMain() {
    function instantAnswer() {
        const answers = document.querySelectorAll('.perseus-radio-option, .perseus-checkbox');
        if(answers.length > 0) {
            answers[Math.floor(Math.random() * answers.length)].click();
            utilities.toast('Resposta selecionada automaticamente!');
        }
    }

    function completeActivities() {
        document.querySelectorAll('.practice-question').forEach(q => {
            const inputs = q.querySelectorAll('input, textarea');
            inputs.forEach(i => i.value = 'Resposta Automática');
            
            const submitBtn = q.querySelector('.submit-btn');
            submitBtn && submitBtn.click();
        });
        utilities.toast('Atividades completadas!');
    }

    plppdo.on('domChanged', () => {
        if(window.features.autoAnswer) instantAnswer();
        if(window.featureConfigs.autoAnswerDelay === 0) completeActivities();
    });

    document.addEventListener('keydown', e => {
        if(e.key === 'F1') completeActivities();
    });
}

/* Initialization */
(async () => {
    setupMenu();
    setupMain();
    utilities.toast('KHANWARE Carregado com Sucesso!', 2000);
})();
