/**
 * Studio.OS v1.0.4 - Main Controller
 * Integrated High-Tech Content Management System
 */

const DATA_URL = 'data.json';
let studioData = { portfolio: [], news: [] };
let activeAdminTab = 'portfolio';
let currentEditId = null;

/**
 * Admin Panel Injection
 */
function injectAdminHTML() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    
    panel.innerHTML = `
        <div id="admin-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 10000; display: none; align-items: center; justify-content: center;">
            <div id="admin-modal" class="t-border" style="background: var(--bg-deep); width: 90%; max-width: 900px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column;">
                <div style="padding: 20px; border-bottom: 1px solid var(--primary-border); display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="color: var(--primary); margin: 0;">ROOT ACCESS // ADMIN PANEL</h3>
                    <button id="admin-close" class="btn-t" style="padding: 5px 15px;">[ CLOSE ]</button>
                </div>
                <div style="padding: 20px; border-bottom: 1px solid var(--primary-border); display: flex; gap: 10px;">
                    <button class="btn-t admin-tabs active" data-tab="portfolio">Portfolio</button>
                    <button class="btn-t admin-tabs" data-tab="news">Signal</button>
                    <button id="add-item-btn" class="btn-t" style="margin-left: auto;">[ + New Item ]</button>
                    <button id="save-data-btn" class="btn-t active">Export JSON</button>
                </div>
                <div id="admin-content" style="flex: 1; overflow-y: auto; padding: 20px;"></div>
            </div>
        </div>
        
        <div id="edit-modal" class="t-border" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10001; display: none; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: var(--bg-deep); width: 100%; max-width: 600px; max-height: 90vh; display: flex; flex-direction: column;">
                <div style="padding: 20px; border-bottom: 1px solid var(--primary-border);">
                    <h3 style="color: var(--primary); margin: 0;">Edit Item</h3>
                </div>
                <div style="flex: 1; overflow-y: auto; padding: 20px;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--primary);">Title</label>
                        <input type="text" id="edit-title" class="btn-t" style="width: 100%; background: var(--bg-surface); color: var(--text-main);">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--primary);">Content</label>
                        <div id="rich-editor" contenteditable="true" class="t-border" style="min-height: 150px; padding: 10px; background: var(--bg-surface); color: var(--text-main); outline: none;"></div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--primary);">Header Image</label>
                        <input type="file" id="header-image-input" accept="image/*">
                    </div>
                </div>
                <div style="padding: 20px; border-top: 1px solid var(--primary-border); display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="modal-cancel" class="btn-t">[ Cancel ]</button>
                    <button id="modal-save" class="btn-t active">[ Save ]</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Core Initialization
 */
document.addEventListener('DOMContentLoaded', async () => {
    injectAdminHTML();
    setupTransitions();
    injectCookieBanner();
    checkCookies();
    setupLangSwitcher();
    setupManifestTyping();
    setupVisualEffects();
    setupContactForm();
    setupLogoTyping();
    setupGhostMessages();
    setupLiveTelemetry();
    setupDotsAnimation();
    setupHeroParticles();
    
    await loadData();
    setupAdmin();
    setupVisualEffects();
    
    // Auto-refresh data every 60 seconds
    setInterval(loadData, 60000);
});

async function loadData() {
    try {
        console.log('SYSTEM: Fetching data signal...');
        const response = await fetch(DATA_URL + '?t=' + Date.now());
        if (!response.ok) throw new Error(`HTTP_ERROR: ${response.status}`);
        
        const data = await response.json();
        console.log('SYSTEM: Data packet received.', data);
        
        studioData.portfolio = data.portfolio || [];
        studioData.news = data.news || [];
        
        renderGrids();
    } catch (error) {
        console.error('SYSTEM_CRITICAL: Data uplink failed.', error);

        // Fallback: restore from cached editable data (if any)
        try {
            const cached = localStorage.getItem('studio_data_cache');
            if (cached) {
                const parsed = JSON.parse(cached);
                studioData.portfolio = parsed.portfolio || [];
                studioData.news = parsed.news || [];
                console.warn('SYSTEM: Restored data from localStorage cache.');
            }
        } catch (e) {
            console.error('SYSTEM_CRITICAL: Cache restore failed.', e);
        }

        // Diagnostic message so the UI doesn't look "empty"
        try {
            const nGrid = document.getElementById('news-grid');
            if (nGrid) {
                const msg = document.createElement('div');
                msg.style.cssText = 'padding: 20px; border: 1px solid var(--primary-border); background: rgba(0,0,0,0.25); color: var(--primary); margin-bottom: 20px;';
                msg.innerText = `NEWS_LOAD_FAILED: ${String(error && error.message ? error.message : error)}`;
                nGrid.prepend(msg);
            }
        } catch (_) {}

        renderGrids();
    }
}

function setupDotsAnimation() {
    const dotsEl = document.getElementById('init-dots');
    if (!dotsEl) return;

    const sequence = ['.', '..', '...', '..', '...'];
    let index = 0;

    setInterval(() => {
        dotsEl.textContent = sequence[index];
        index = (index + 1) % sequence.length;
    }, 300); // Change every 0.3s
}

function setupHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 100; // More particles

    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4, // Faster
            vy: (Math.random() - 0.5) * 4,
            radius: Math.random() * 3 + 1, // Larger
            alpha: Math.random() * 0.3 + 0.2 // More transparent
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 243, 255, ${p.alpha})`; // Cyan particles
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function injectCookieBanner() {
    if (document.getElementById('cookie-banner')) return;
    
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner t-border';
    banner.innerHTML = `
        <div style="display: flex; gap: 20px; align-items: center;">
            <i data-lucide="shield-check" style="color: var(--primary);"></i>
            <div>
                <span class="label-md" style="color: var(--primary); display: block; margin-bottom: 5px;">SECURITY_PROTOCOL: COOKIE_CONSENT</span>
                <p data-i18n="cookie-desc" style="font-size: 11px; color: var(--text-dim); margin: 0;">Мы используем куки для оптимизации работы терминала. Нажимая [ACCEPT], вы подтверждаете протокол передачи данных.</p>
            </div>
        </div>
        <div style="display: flex; gap: 15px;">
            <a href="datenschutz.html" class="nav-link" style="font-size: 10px;">READ_POLICY</a>
            <button id="accept-cookies" class="btn-t active" style="padding: 8px 20px;">[ ACCEPT ]</button>
        </div>
    `;
    document.body.appendChild(banner);
    lucide.createIcons();
    
    document.getElementById('accept-cookies').addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'true');
        banner.classList.remove('active');
    });
}

function checkCookies() {
    setTimeout(() => {
        if (!localStorage.getItem('cookies-accepted')) {
            document.getElementById('cookie-banner').classList.add('active');
        }
    }, 2000);
}

function setupLangSwitcher() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    // Detect browser language
    const browserLang = navigator.language.toLowerCase().split('-')[0]; // e.g., 'de' from 'de-DE'
    const supportedLangs = ['de', 'ru', 'en'];
    let defaultLang = 'de'; // Default to German

    if (supportedLangs.includes(browserLang)) {
        defaultLang = browserLang;
    }

    let currentLang = localStorage.getItem('studio-lang') || defaultLang;

    const switcher = document.createElement('div');
    switcher.className = 'lang-switch';
    switcher.innerHTML = `
        <button class="lang-btn ${currentLang === 'ru' ? 'active' : ''}" data-lang="ru">RU</button>
        <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
        <button class="lang-btn ${currentLang === 'de' ? 'active' : ''}" data-lang="de">DE</button>
    `;
    navActions.prepend(switcher);

    switcher.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switcher.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentLang = btn.dataset.lang;
            localStorage.setItem('studio-lang', currentLang);
            applyLanguage(currentLang);
            
            console.log(`SYSTEM: Language switched to ${currentLang.toUpperCase()}`);
        });
    });

    // Apply initially
    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    if (!window.translations || !window.translations[lang]) return;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (window.translations[lang][key]) {
            el.innerHTML = window.translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (window.translations[lang][key]) {
            el.placeholder = window.translations[lang][key];
        }
    });

    // Re-trigger typing effect if we are on the UPLINK page
    if (document.getElementById('manifest-content')) {
        setupManifestTyping();
    }
}


/**
 * Manifest Typewriter Logic
 */
function renderGrids() {
    const pGrid = document.getElementById('portfolio-grid');
    const nGrid = document.getElementById('news-grid');
    
    // Determine if we are on the main page to apply limits
    const isMain = window.location.pathname.endsWith('index.html') || 
                   window.location.pathname.endsWith('/') || 
                   (!window.location.pathname.includes('.html'));

    if (pGrid) renderPortfolio(null);
    if (nGrid) renderNews(null);
}

function renderPortfolio(limit = null) {
    const grid = document.getElementById('portfolio-grid');
    if (!grid || !studioData.portfolio) return;

    console.log('Rendering portfolio:', studioData.portfolio.length, 'items');
    let items = [...studioData.portfolio].reverse(); // Latest first
    if (limit) items = items.slice(0, limit);

    grid.innerHTML = items.map((item, index) => `
        <article class="t-card t-border">
            <div class="card-img-wrapper">
                <img src="${item.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'}" alt="${item.title}">
                <div class="scanline"></div>
            </div>
            <div class="card-body">
                <div class="card-meta">NODE_ID: 00${index + 1} // ${item.category || 'PROJECT'}</div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-excerpt" data-i18n="proj-${index + 1}-desc" style="color: var(--text-dim); font-size: 13px;">${item.description.substring(0, 100)}...</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                    <span class="label-md" style="font-size: 9px; opacity: 0.6;">${item.tags || 'REACT / TYPESCRIPT'}</span>
                    <a href="${item.link || '#'}" class="btn-t" style="font-size: 10px;">Access_Project</a>
                </div>
            </div>
        </article>
    `).join('');
    console.log('Portfolio rendered with', items.length, 'items');
}

function renderNews(limit = null) {
    const grid = document.getElementById('news-grid');
    if (!grid || !studioData.news) return;

    let items = [...studioData.news].reverse(); // Latest first
    if (limit) items = items.slice(0, limit);

    grid.innerHTML = items.map((item, index) => `
        <article class="t-card t-border">
            <div class="card-body">
                <div class="card-meta">SIGNAL_TYPE: ${item.tag || 'UPDATE'} // ${item.date || 'RECENT'}</div>
                <h3 class="card-title">${item.title}</h3>
                <p style="color: var(--text-dim); margin-bottom: 16px;">${item.content.substring(0, 120).replace(/<[^>]*>/g, '')}...</p>
                <button class="btn-t" style="font-size: 10px;" onclick="viewNews(${index})">Read_Signal</button>
            </div>
        </article>
    `).join('');
}

window.viewProject = (idx) => {
    const item = studioData.portfolio[idx];
    alert(`PROJECT_DETAILS: ${item.title}\n${item.description.replace(/<[^>]*>/g, '')}`);
};

window.viewNews = (idx) => {
    const item = studioData.news[idx];
    alert(`SIGNAL_LOG: ${item.title}\n${item.content.replace(/<[^>]*>/g, '')}`);
}


/**
 * Navigation & Scroll
 */
function setupNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Admin Logic (The "Hidden" Panel)
 */
function setupAdmin() {
    const adminPanel = document.getElementById('admin-panel');
    const closeBtn = document.getElementById('admin-close');
    const saveBtn = document.getElementById('save-data-btn');
    const addBtn = document.getElementById('add-item-btn');
    const modal = document.getElementById('edit-modal');
    const modalCancel = document.getElementById('modal-cancel');
    const modalSave = document.getElementById('modal-save');

    closeBtn.onclick = () => adminPanel.classList.remove('active');

    // Secret Activation 1: Key Sequence (Ctrl + Shift + A)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
            adminPanel.classList.toggle('active');
            renderAdminContent();
        }
    });

    // Secret Activation 2: Click Trigger (5 clicks on Secure Connection)
    const trigger = document.getElementById('admin-trigger');
    let clickCount = 0;
    let clickTimer;
    if (trigger) {
        trigger.style.cursor = 'pointer';
        trigger.onclick = () => {
            clearTimeout(clickTimer);
            clickCount++;
            
            // Visual feedback (flash)
            trigger.style.color = '#fff';
            setTimeout(() => trigger.style.color = 'var(--primary)', 100);

            if (clickCount >= 5) {
                adminPanel.classList.add('active');
                renderAdminContent();
                clickCount = 0;
                console.log('SYSTEM_MSG: Root access granted.');
            }
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 1000);
        };
    }

    // Tab Switching
    document.querySelectorAll('.admin-tabs .btn-t').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.admin-tabs .btn-t').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeAdminTab = btn.dataset.tab;
            renderAdminContent();
        };
    });

    addBtn.onclick = () => {
        currentEditId = null;
        openEditModal();
    };

    modalCancel.onclick = () => modal.classList.remove('active');
    modalSave.onclick = saveModalData;

    saveBtn.onclick = () => {
        const blob = new Blob([JSON.stringify(studioData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        alert('SYSTEM_MSG: Configuration exported. Push to GitHub to finalize.');
    };

    // Image Handlers
    document.getElementById('header-image-input').onchange = (e) => handleImage(e, 'header');
    document.getElementById('inline-image-input').onchange = (e) => handleImage(e, 'inline');
}

function renderAdminContent() {
    const container = document.getElementById('admin-content');
    const items = studioData[activeAdminTab];
    
    container.innerHTML = items.map((item, idx) => `
        <div class="admin-item t-border" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; margin-bottom: 10px; background: var(--bg-surface);">
            <div>
                <span style="color: var(--primary); font-size: 10px;">ID: ${idx}</span>
                <div style="font-weight: 500;">${item.title}</div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn-t" onclick="editItem(${idx})" style="padding: 5px 10px; font-size: 10px;">Edit</button>
                <button class="btn-t" onclick="deleteItem(${idx})" style="padding: 5px 10px; font-size: 10px; border-color: var(--accent-red); color: var(--accent-red);">Drop</button>
            </div>
        </div>
    `).join('');
}

/**
 * Edit Modal Functions
 */
function openEditModal(idx = null) {
    const modal = document.getElementById('edit-modal');
    const editor = document.getElementById('rich-editor');
    const title = document.getElementById('edit-title');
    
    if (idx !== null) {
        const item = studioData[activeAdminTab][idx];
        title.value = item.title;
        editor.innerHTML = activeAdminTab === 'portfolio' ? item.description : item.content;
    } else {
        title.value = '';
        editor.innerHTML = '';
    }
    
    modal.classList.add('active');
}

window.editItem = (idx) => {
    currentEditId = idx;
    openEditModal(idx);
};

window.deleteItem = (idx) => {
    if (confirm('SYSTEM_PROMPT: Delete this node?')) {
        studioData[activeAdminTab].splice(idx, 1);
        renderAdminContent();
        renderGrids();
        localStorage.setItem('studio_data_cache', JSON.stringify(studioData));
    }
};

function saveModalData() {
    const title = document.getElementById('edit-title').value;
    const content = document.getElementById('rich-editor').innerHTML;
    
    const newItem = {
        title,
        ...(activeAdminTab === 'portfolio' ? { description: content } : { content: content }),
        date: new Date().toLocaleDateString(),
        image: studioData[activeAdminTab][currentEditId]?.image || 'assets/hero.png'
    };

    if (currentEditId !== null) {
        studioData[activeAdminTab][currentEditId] = { ...studioData[activeAdminTab][currentEditId], ...newItem };
    } else {
        studioData[activeAdminTab].unshift(newItem);
    }

    document.getElementById('edit-modal').classList.remove('active');
    renderAdminContent();
    renderGrids();
    localStorage.setItem('studio_data_cache', JSON.stringify(studioData));
}

function handleImage(e, type) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        if (type === 'header' && currentEditId !== null) {
            studioData[activeAdminTab][currentEditId].image = event.target.result;
        } else if (type === 'inline') {
            const img = `<img src="${event.target.result}" style="max-width: 100%; border: 1px solid var(--primary-border); margin: 10px 0;">`;
            document.execCommand('insertHTML', false, img);
        }
    };
    reader.readAsDataURL(file);
}

/**
 * Visual Effects
 */
function setupVisualEffects() {

    const cursor = document.querySelector('.cursor-glow');
    const tooltip = document.createElement('div');
    tooltip.className = 't-tooltip';
    document.body.appendChild(tooltip);

    document.addEventListener('mousemove', (e) => {
        // Cursor Glow
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Tooltip Logic
        const target = e.target.closest('[data-tooltip]');
        if (target) {
            tooltip.innerText = target.dataset.tooltip;
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        } else {
            tooltip.style.display = 'none';
        }
    });
}

function setupTransitions() {
    // 1. Inject Loader if not present
    let loader = document.querySelector('.page-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-text">INITIALIZING SYSTEM</div>
            <div class="loader-bar"></div>
        `;
        document.body.appendChild(loader);
    }

    // 2. Initial Fade Out
    setTimeout(() => {
        loader.classList.add('fade-out');
    }, 600);

    // 3. Global Link Interceptor (Delegation)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        // Only intercept internal .html links that aren't anchors
        if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#')) {
            e.preventDefault();
            loader.classList.remove('fade-out');
            
            // Critical transition
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        }
    });

    // 4. Handle BFCache (Back button)
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            // Re-hide the loader if we navigated back to this page
            loader.classList.add('fade-out');
        }
    });
}

let typingTimer;

function setupManifestTyping() {
    const terminal = document.getElementById('manifest-content');
    if (!terminal) return;

    if (typingTimer) clearTimeout(typingTimer);

    console.log('SYSTEM: Manifest terminal detected. Initializing uplink broadcast...');

    const currentLang = localStorage.getItem('studio-lang') || 'ru';
    // Use window.translations or fallback text if translations script failed to load
    const baseText = "Граница между фантомом и материей стирается. В мире, где алгоритмы диктуют правила, твоя фантазия — последний оплот свободы. Загрузи свои видения в наш терминал. Мы воплотим их в пикселях и неоне, прежде чем сеть поглотит всё. Твой проект. Твой манифест. Наша реализация.";
    const text = (window.translations && window.translations[currentLang] && window.translations[currentLang]['manifest-desc']) 
                    ? window.translations[currentLang]['manifest-desc'] 
                    : baseText;

    let i = 0;
    
    // Ensure visibility
    terminal.style.opacity = '1';
    terminal.innerHTML = '<span class="cursor-line">_</span>';

    function type() {
        if (i < text.length) {
            terminal.innerHTML = text.substring(0, i + 1) + '<span class="cursor-line">_</span>';
            i++;
            typingTimer = setTimeout(type, 20); // Slightly faster typing
        }
    }

    // Start typing after a short delay (glitch duration)
    typingTimer = setTimeout(type, 1000);
}

function setupLogoTyping() {
    const logoEl = document.querySelector('.logo span') || document.querySelector('.logo a');
    if (!logoEl) return;
    
    const sequence = [
        { text: "STUDIO.OS v1.0.4", blinks: 10 },
        { text: "present", blinks: 3 },
        { text: "WEB STUDIO OLEH KALCHENKO", blinks: 10 }
    ];
    
    let seqIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let blinkCount = 0;
    
    function typeCycle() {
        const currentData = sequence[seqIndex];
        const currentText = currentData.text;
        
        if (isDeleting) {
            logoEl.innerHTML = currentText.substring(0, charIndex) + '<span class="cursor-line" style="display:inline-block; opacity:1;">_</span>';
            charIndex--;
            if (charIndex < 0) {
                isDeleting = false;
                seqIndex = (seqIndex + 1) % sequence.length;
                setTimeout(typeCycle, 300);
            } else {
                setTimeout(typeCycle, 40); // Fast delete
            }
        } else {
            logoEl.innerHTML = currentText.substring(0, charIndex) + '<span class="cursor-line" style="display:inline-block; opacity:1;">_</span>';
            charIndex++;
            if (charIndex > currentText.length) {
                blinkCount = 0;
                blinkCycle(currentData.blinks);
            } else {
                setTimeout(typeCycle, 100); // Type speed
            }
        }
    }
    
    function blinkCycle(maxBlinks) {
        if (blinkCount < maxBlinks * 2) {
            const cursor = logoEl.querySelector('.cursor-line');
            if (cursor) {
                cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            }
            blinkCount++;
            setTimeout(() => blinkCycle(maxBlinks), 500); // 500ms per half-blink
        } else {
            isDeleting = true;
            charIndex = sequence[seqIndex].text.length;
            typeCycle();
        }
    }

    logoEl.innerHTML = '<span class="cursor-line" style="display:inline-block; opacity:1;">_</span>';
    setTimeout(typeCycle, 1000);
}

function setupGhostMessages() {
    const container = document.createElement('div');
    container.id = 'ghost-message';
    container.style.position = 'fixed';
    container.style.bottom = '30px';
    container.style.right = '30px';
    container.style.maxWidth = '250px';
    container.style.color = 'var(--primary)';
    container.style.fontFamily = '"JetBrains Mono", monospace';
    container.style.fontSize = '12px';
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    container.style.textShadow = '0 0 10px var(--primary)';
    container.style.borderLeft = '2px solid var(--primary)';
    container.style.background = 'rgba(10, 10, 15, 0.8)';
    container.style.backdropFilter = 'blur(4px)';
    container.style.padding = '12px 16px';
    container.style.boxShadow = '0 0 20px rgba(0, 255, 60, 0.1)';
    
    document.body.appendChild(container);

    function showRandomMessage() {
        const msgIndex = Math.floor(Math.random() * 12) + 1;
        const currentLang = localStorage.getItem('studio-lang') || 'ru';
        
        if(window.translations && window.translations[currentLang]) {
            const text = window.translations[currentLang][`ghost-msg-${msgIndex}`];
            if(text) {
                container.innerHTML = `<span style="opacity:0.6; font-size:10px;">[SYS.WHISPER]</span><br><span style="color:var(--text-main); line-height: 1.5; display:block; margin-top:5px;">${text}</span>`;
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
                
                // Hide after 6 seconds
                setTimeout(() => {
                    container.style.opacity = '0';
                    container.style.transform = 'translateY(20px)';
                }, 6000);
            }
        }
        
        // Schedule next message (random interval between 15s and 30s)
        const nextTime = 15000 + Math.random() * 15000;
        setTimeout(showRandomMessage, nextTime);
    }

    // Start after 5 seconds
    setTimeout(showRandomMessage, 5000);
}

function setupLiveTelemetry() {
    const pingEl = document.getElementById('telemetry-ping');
    const uptimeEl = document.getElementById('telemetry-uptime');
    const statusEl = document.getElementById('telemetry-status');
    const modeEl = document.getElementById('telemetry-mode');
    const barsContainer = document.getElementById('telemetry-bars');
    const neuralCanvas = document.getElementById('neural-canvas');

    if (!pingEl || !uptimeEl || !statusEl) return;

    const latencyBar = barsContainer ? barsContainer.querySelector('[data-bar="latency"]') : null;
    const uptimeBar = barsContainer ? barsContainer.querySelector('[data-bar="uptime"]') : null;

    const microgrid = document.querySelector('.telemetry-microgrid');
    const microPoints = microgrid ? Array.from(microgrid.querySelectorAll('.tp')) : [];

    let uptime = 99.9981;
    statusEl.innerText = statusEl.innerText || 'Optimized';

    // Text-based Server Deployment Log Display
    // Simulates live deployment with errors, warnings, and status changes
    if (neuralCanvas) {
        const ctx = neuralCanvas.getContext('2d');
        const w = neuralCanvas.width = neuralCanvas.offsetWidth;
        const h = neuralCanvas.height = neuralCanvas.offsetHeight;
        
        const logLines = [];
        const maxLines = 24;
        
        // Dynamic log messages that change frequently
        const infoMessages = [
            'Fetching build artifacts...',
            'Compiling modules...',
            'Bundling assets...',
            'Minifying code...',
            'Generating hashes...',
            'Uploading chunk 1/12...',
            'Uploading chunk 2/12...',
            'Uploading chunk 3/12...',
            'Server responding...',
            'Applying patches...',
            'Reloading cache...',
            'Verifying checksums...',
            'Health check OK',
            'Latency: 24ms',
            'Memory: 45%',
            'CPU: 12%',
            'Active connections: 42'
        ];
        
        const errorMessages = [
            'ERROR: Build failed - syntax error',
            'ERROR: Memory limit exceeded',
            'ERROR: Connection refused',
            'ERROR: Timeout after 30s',
            'ERROR: Cannot find module react'
        ];
        
        const warningMessages = [
            'WARN: Deprecated API usage detected',
            'WARN: Unused variable in module',
            'WARN: Bundle size exceeds limit',
            'WARN: Slow response time',
            'WARN: Cache miss rate high'
        ];
        
        let time = 0;
        let messageCounter = 0;
        
        function renderLogs() {
            ctx.fillStyle = 'rgba(8, 12, 20, 0.95)';
            ctx.fillRect(0, 0, w, h);
            
            ctx.font = '11px JetBrains Mono';
            ctx.textBaseline = 'top';
            
            const lineHeight = 14;
            const padding = 8;
            
            logLines.forEach((line, idx) => {
                let color;
                const pulse = Math.sin(time * 3 + idx * 0.5) * 0.3 + 0.7;
                switch(line.type) {
                    case 'error': 
                        color = `rgb(${Math.floor(255 * pulse)}, ${Math.floor(80 * pulse)}, ${Math.floor(150 * pulse)})`; 
                        break;
                    case 'warning': 
                        color = `rgb(${Math.floor(0)}, ${Math.floor(220 * pulse)}, ${Math.floor(255 * pulse)})`; 
                        break;
                    case 'success': 
                        color = `rgb(${Math.floor(0)}, ${Math.floor(240 * pulse)}, ${Math.floor(255 * pulse)})`; 
                        break;
                    default: 
                        color = `rgb(${Math.floor(0)}, ${Math.floor(180 * pulse)}, ${Math.floor(200 * pulse)})`;
                }
                ctx.fillStyle = color;
                ctx.fillText(line.text, padding, padding + idx * lineHeight);
            });
            
            // Blinking cursor with cyan color
            if (Math.floor(time * 5) % 2 === 0) {
                ctx.fillStyle = '#00f3ff';
                const lastLine = logLines[logLines.length - 1];
                const cursorX = padding + 2 + (lastLine?.text.length || 0) * 6.5;
                ctx.fillText('_', cursorX, padding + (logLines.length - 1) * lineHeight);
            }
        }
        
        function animate() {
            time += 0.03;
            
            // More frequent updates for "alive" feel
            if (Math.random() < 0.08) {
                messageCounter++;
                let msg;
                
                // Every 10 messages, trigger an error or warning
                if (messageCounter % 10 === 0) {
                    if (Math.random() < 0.4) {
                        msg = { type: 'error', text: errorMessages[Math.floor(Math.random() * errorMessages.length)] };
                    } else {
                        msg = { type: 'warning', text: warningMessages[Math.floor(Math.random() * warningMessages.length)] };
                    }
                } else if (messageCounter % 5 === 0) {
                    msg = { type: 'success', text: 'Build succeeded' };
                } else {
                    msg = { type: 'info', text: infoMessages[Math.floor(Math.random() * infoMessages.length)] };
                }
                
                logLines.push(msg);
                
                if (logLines.length > maxLines) {
                    logLines.shift();
                }
            }
            
            renderLogs();
            requestAnimationFrame(animate);
        }
        
        // Initial message
        logLines.push({ type: 'info', text: 'DEPLOY_MONITOR_INITIALIZED' });
        logLines.push({ type: 'success', text: 'Connection established' });
        animate();
    }

    function setMicro(activeIdx, strength = 1) {
        if (!microPoints.length) return;
        microPoints.forEach((p, i) => {
            const on = Math.abs(i - activeIdx) <= 1;
            p.style.opacity = on ? String(0.25 + 0.6 * strength) : '0.08';
            p.style.transform = on ? 'translateY(-1px) scale(1.04)' : 'translateY(0) scale(1)';
            p.style.filter = on ? 'drop-shadow(0 0 10px rgba(0,255,60,0.35))' : 'none';
        });
    }

    function setBars(latencyMs, upPct) {
        if (latencyBar) {
            const t = Math.max(0, Math.min(1, (latencyMs - 10) / 30));
            latencyBar.style.height = `${22 + t * 28}%`;
            latencyBar.style.opacity = String(0.55 + t * 0.45);
            latencyBar.style.transform = `translateY(${(1 - t) * 2}px)`;
        }
        if (uptimeBar) {
            const t = Math.max(0, Math.min(1, (upPct - 99.998) / 0.0025));
            uptimeBar.style.height = `${22 + t * 28}%`;
            uptimeBar.style.opacity = String(0.55 + t * 0.45);
            uptimeBar.style.transform = `translateY(${(1 - t) * 2}px)`;
        }
    }

    function glitchStatus(next) {
        const oldStatus = statusEl.innerText;
        const oldColor = statusEl.style.color || 'var(--primary)';

        statusEl.innerText = next;
        statusEl.style.color = '#ffcc00';
        if (modeEl) modeEl.innerText = 'MODE: CALIBRATING';

        const idx = microPoints.length ? Math.floor(Math.random() * microPoints.length) : 0;
        setMicro(idx, 1);

        setTimeout(() => {
            statusEl.innerText = oldStatus;
            statusEl.style.color = oldColor;
            if (modeEl) modeEl.innerText = 'MODE: VERIFIED';
        }, 800);
    }

    function tickPing() {
        const ping = Math.floor(Math.random() * 25) + 12; // 12..36ms
        pingEl.innerText = `${ping}ms`;

        const idx = microPoints.length ? (ping % microPoints.length) : 0;
        setMicro(idx, 0.85);

        setBars(ping, uptime);

        setTimeout(tickPing, 900 + Math.random() * 2200);
    }

    if (modeEl) modeEl.innerText = 'MODE: VERIFIED';

    tickPing();

    setInterval(() => {
        uptime += 0.0001;
        if (uptime > 99.9999) uptime = 99.9981;
        uptimeEl.innerText = `${uptime.toFixed(4)}%`;

        const currentPing = Number((pingEl.innerText || '24ms').replace('ms', '')) || 24;
        setMicro(Math.floor(Math.random() * (microPoints.length || 1)), 0.6);
        setBars(currentPing, uptime);
    }, 2200);

    setInterval(() => {
        const variants = ['[ SCANNING... ]', '[ VERIFYING... ]', '[ ROUTING... ]'];
        glitchStatus(variants[Math.floor(Math.random() * variants.length)]);
    }, 9500);
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('name-input');
        const emailInput = document.getElementById('email-input');
        const msgInput = document.getElementById('msg-input');
        
        const nameErr = document.getElementById('name-error');
        const emailErr = document.getElementById('email-error');
        const msgErr = document.getElementById('msg-error');
        
        // Reset errors
        nameErr.textContent = '';
        emailErr.textContent = '';
        msgErr.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        msgInput.classList.remove('error');

        const currentLang = localStorage.getItem('studio-lang') || 'ru';
        const t = window.translations && window.translations[currentLang] ? window.translations[currentLang] : {};
        
        const reqMsg = t['err-required'] || "ERR: REQUIRED";
        const emailMsg = t['err-email'] || "ERR: INVALID_EMAIL";

        let isValid = true;

        if (!nameInput.value.trim()) {
            nameErr.textContent = reqMsg;
            nameInput.classList.add('error');
            isValid = false;
        }

        if (!emailInput.value.trim()) {
            emailErr.textContent = reqMsg;
            emailInput.classList.add('error');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            emailErr.textContent = emailMsg;
            emailInput.classList.add('error');
            isValid = false;
        }

        if (!msgInput.value.trim()) {
            msgErr.textContent = reqMsg;
            msgInput.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            console.log('SYSTEM: PACKET_TRANSMITTED');
            form.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--primary);">
                                <i data-lucide="check-circle" style="width: 48px; height: 48px; margin-bottom: 20px;"></i>
                                <h3 style="margin: 0;">TRANSMISSION_SUCCESS</h3>
                              </div>`;
            lucide.createIcons();
        }
    });
}
