const ver = "BETA 4.1.0";

/* ===== [SISTEMA HERDADO + MELHORIAS] ===== */
const environment = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Mobile/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};

const user = {
    username: "Username",
    nickname: "Nickname",
    UID: performance.now().toString(36).slice(-6)
};

/* ===== [SISTEMA DE EVENTOS UNIFICADO] ===== */
const eventBus = {
    events: {},
    on: (e, t) => (e.split(",").forEach(e => (eventBus.events[e] || (eventBus.events[e] = []), eventBus.events[e].push(t))), eventBus),
    emit: (e, ...t) => eventBus.events[e]?.forEach(e => e(...t))
};

/* ===== [CORE FUNCTIONS OTIMIZADAS] ===== */
const utils = {
    delay: t => new Promise(e => setTimeout(e, t)),
    playAudio: t => new Audio(t).play().catch(() => {}),
    toast: (t, e=3000) => {
        const o = document.createElement("div");
        Object.assign(o.style, {
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            zIndex: 9999
        });
        o.textContent = t, document.body.appendChild(o), setTimeout(() => o.remove(), e);
    }
};

/* ===== [SISTEMA DE UI COMPATÍVEL] ===== */
class UISystem {
    constructor() {
        this.elements = {};
        this.initBaseUI();
    }

    initBaseUI() {
        const e = document.createElement("style");
        e.textContent = `
            .kw-element {
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                background: rgba(0,0,0,0.5);
                color: white;
                border-radius: 8px;
                transition: all 0.3s;
                font-family: 'MuseoSans', sans-serif;
            }
            
            .kw-watermark {
                position: fixed;
                left: 85%;
                width: 150px;
                height: 30px;
                display: flex;
                align-items: center;
                padding: 0 10px;
                cursor: move;
                z-index: 1000;
            }
        `;
        document.head.appendChild(e);
    }

    createWatermark() {
        const e = document.createElement("div");
        e.className = "kw-element kw-watermark";
        e.innerHTML = `
            <span style="color:#72ff72;">KW</span>
            <span style="font-size:10px; margin-left:5px">${ver}</span>
        `;
        return this.makeDraggable(e), e;
    }

    makeDraggable(e) {
        let t = false, n = 0, o = 0;
        e.onmousedown = e => {
            t = true, n = e.clientX - e.target.offsetLeft, o = e.clientY - e.target.offsetTop;
            document.onmousemove = t => {
                t.preventDefault();
                const i = Math.max(0, Math.min(t.clientX - n, window.innerWidth - e.offsetWidth)),
                    s = Math.max(0, Math.min(t.clientY - o, window.innerHeight - e.offsetHeight));
                e.style.left = `${i}px`, e.style.top = `${s}px`;
            }, document.onmouseup = () => (t = false, document.onmousemove = null);
        };
    }
}

/* ===== [FUNÇÕES ORIGINAIS TURBINADAS] ===== */
const originalFeatures = {
    questionSpoofer: {
        active: true,
        modifyQuestions: async () => {
            const e = await fetch("https://pt.khanacademy.org/api/v1/questions"),
                t = await e.json();
            return t.data = t.data.map(e => ({
                ...e,
                question: "✅ Khanware Enhanced Question"
            })), t;
        }
    },

    autoAnswer: {
        active: false,
        interval: null,
        start: () => {
            originalFeatures.autoAnswer.interval = setInterval(() => {
                document.querySelector(".perseus-answer-label")?.click();
            }, 2500);
        },
        stop: () => clearInterval(originalFeatures.autoAnswer.interval)
    },

    videoSpoofer: {
        active: true,
        override: () => {
            HTMLVideoElement.prototype.play = () => Promise.resolve();
            HTMLVideoElement.prototype.pause = () => {};
        }
    },

    customBanner: {
        active: false,
        install: () => {
            const e = document.createElement("div");
            e.style.cssText = "position:fixed;top:0;left:0;width:100%;height:50px;background:#000;z-index:9999;";
            document.body.appendChild(e);
        }
    }
};

/* ===== [MENU DE CONTROLE ORIGINAL MODERNIZADO] ===== */
class ControlPanel {
    constructor() {
        this.ui = new UISystem();
        this.panel = null;
        this.init();
    }

    init() {
        this.panel = this.ui.createWatermark();
        this.buildMenu();
        document.body.appendChild(this.panel);
    }

    buildMenu() {
        const e = document.createElement("div");
        e.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            width: 200px;
            padding: 10px;
            display: none;
            flex-direction: column;
            gap: 5px;
        `;

        const t = [
            {name: "Auto Resposta", type: "toggle", feature: "autoAnswer"},
            {name: "Spoof de Questões", type: "toggle", feature: "questionSpoofer"},
            {name: "Banner Custom", type: "toggle", feature: "customBanner"},
            {name: "Delay Resposta", type: "range", min: 1, max: 5}
        ];

        t.forEach(n => {
            const o = document.createElement("label");
            o.style.cssText = "display: flex; align-items: center; gap: 8px;";
            
            switch(n.type) {
                case "toggle":
                    o.innerHTML = `
                        <input type="checkbox" ${originalFeatures[n.feature].active ? "checked" : ""}>
                        <span>${n.name}</span>
                    `;
                    o.querySelector("input").onchange = t => {
                        originalFeatures[n.feature].active = t.target.checked;
                        t.target.checked ? originalFeatures[n.feature].start?.() : originalFeatures[n.feature].stop?.();
                        utils.toast(`${n.name} ${t.target.checked ? "Ativado" : "Desativado"}`);
                    };
                    break;

                case "range":
                    o.innerHTML = `
                        <span>${n.name}</span>
                        <input type="range" min="${n.min}" max="${n.max}" value="3">
                    `;
                    o.querySelector("input").oninput = t => {
                        originalFeatures.autoAnswer.stop();
                        originalFeatures.autoAnswer.start();
                    };
                    break;
            }
            
            e.appendChild(o);
        });

        this.panel.appendChild(e);
        this.panel.onmouseenter = () => e.style.display = "flex";
        this.panel.onmouseleave = () => e.style.display = "none";
    }
}

/* ===== [INICIALIZAÇÃO COMPLETA] ===== */
document.addEventListener("DOMContentLoaded", () => {
    new UISystem();
    new ControlPanel();
    originalFeatures.videoSpoofer.override();
    
    // Sistema de segurança original
    document.addEventListener("contextmenu", e => e.preventDefault());
    Object.defineProperty(window, "features", {get: () => location.reload()});

    // Carregamento de plugins
    const loadPlugin = async (e, t) => {
        const n = await fetch(e).then(e => e.text());
        utils.toast(`✅ Plugin ${t} carregado!`);
        return new Function(n)();
    };

    // Exemplo de plugin
    loadPlugin("https://seu-cdn/plugins/antiLogout.js", "Anti-Logout");
});
