// ==========================================================================
// DASHBOARD DO CURSO - ESTADO DINÂMICO DE PROGRESSO E MÓDULOS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       1. SISTEMA DE PROGRESSÃO DESSA PLATAFORMA (LOCALSTORAGE)
       ========================================================================== */
    
    // Pegando estados de conclusão salvos no navegador
    const checkCompletionStates = () => {
        return {
            mod1: localStorage.getItem('muleacademy_completed_1') === 'true',
            mod2: localStorage.getItem('muleacademy_completed_2') === 'true',
            mod3: localStorage.getItem('muleacademy_completed_3') === 'true',
            mod4: localStorage.getItem('muleacademy_completed_4') === 'true',
            mod5: localStorage.getItem('muleacademy_completed_5') === 'true'
        };
    };

    // Auxiliar para trocar ícones do Lucide de forma segura após renderização inicial
    const setLucideIcon = (parentEl, newIconName) => {
        const iconEl = parentEl.querySelector('i') || parentEl.querySelector('svg');
        if (iconEl) {
            const newIcon = document.createElement('i');
            newIcon.setAttribute('data-lucide', newIconName);
            iconEl.replaceWith(newIcon);
        }
    };

    // Renderiza a interface de progresso e destrava módulos sequencialmente
    const renderDashboardProgress = () => {
        const states = checkCompletionStates();
        let completedCount = 0;
        
        if (states.mod1) completedCount++;
        if (states.mod2) completedCount++;
        if (states.mod3) completedCount++;
        if (states.mod4) completedCount++;
        if (states.mod5) completedCount++;

        // 1. Atualizar círculo radial de progresso e textos da plataforma
        const radialFill = document.getElementById('radial-progress-fill');
        const progressPercentText = document.getElementById('progress-text');
        const progressTextDesc = document.getElementById('progress-text-desc');
        const footerCountText = document.getElementById('footer-modules-count');
        const footerBtn = document.getElementById('btn-footer-continue');

        const percent = (completedCount / 5) * 100;
        
        if (progressPercentText) progressPercentText.textContent = `${percent}%`;
        if (progressTextDesc) progressTextDesc.textContent = `${completedCount} de 5 Módulos concluídos`;
        if (footerCountText) footerCountText.textContent = `${completedCount} / 5`;

        // Circunferência total do círculo SVG radial (2 * PI * r) = 251.2
        const totalCircumference = 251.2;
        const dashoffset = totalCircumference - (totalCircumference * (completedCount / 5));
        if (radialFill) {
            radialFill.style.strokeDasharray = `${totalCircumference}`;
            radialFill.style.strokeDashoffset = `${dashoffset}`;
        }

        // 2. Controlar o botão CTA principal no rodapé (Footer CTA)
        if (footerBtn) {
            if (completedCount === 0) {
                footerBtn.innerHTML = '<span>Iniciar Módulo 1</span><i data-lucide="arrow-right"></i>';
                footerBtn.onclick = () => window.location.href = "index.html";
            } else if (completedCount === 1) {
                footerBtn.innerHTML = '<span>Iniciar Módulo 2</span><i data-lucide="arrow-right"></i>';
                footerBtn.onclick = () => window.location.href = "modulo2.html";
            } else if (completedCount === 2) {
                footerBtn.innerHTML = '<span>Iniciar Módulo 3</span><i data-lucide="arrow-right"></i>';
                footerBtn.onclick = () => window.location.href = "modulo3.html";
            } else if (completedCount === 3) {
                footerBtn.innerHTML = '<span>Iniciar Módulo 4</span><i data-lucide="arrow-right"></i>';
                footerBtn.onclick = () => window.location.href = "modulo4.html";
            } else if (completedCount === 4) {
                footerBtn.innerHTML = '<span>Iniciar Módulo 5</span><i data-lucide="arrow-right"></i>';
                footerBtn.onclick = () => window.location.href = "modulo5.html";
            } else if (completedCount === 5) {
                footerBtn.innerHTML = '<span>Parabéns! Curso Concluído 🎓</span>';
                footerBtn.classList.replace('btn-accent', 'btn-primary');
                footerBtn.onclick = null;
            }
        }

        // 3. Atualizar cada um dos cards de Módulo (Desbloqueados vs Bloqueados)
        const updateCardAndSubitem = (modNum, isUnlocked, isCompleted, pageUrl, badgeName) => {
            const card = document.getElementById(`card-mod${modNum}`);
            const badge = document.getElementById(`badge-mod${modNum}`);
            const btn = document.getElementById(`btn-mod${modNum}`);
            const subitem = document.getElementById(`nav-sub-mod${modNum}`);

            // Remove classes anteriores
            if (card) {
                card.classList.remove('completed-module', 'highlight-module');
            }

            if (isCompleted) {
                // Estado: CONCLUÍDO
                if (card) card.classList.add('completed-module');
                if (badge) {
                    badge.className = 'module-status-badge';
                    badge.innerHTML = '<i data-lucide="check-circle" class="text-emerald"></i> Concluído';
                }
                if (btn) {
                    btn.className = 'btn btn-outline btn-sm mt-auto';
                    btn.textContent = 'Rever Aula';
                    btn.style.pointerEvents = 'auto';
                }
                if (subitem) {
                    subitem.style.pointerEvents = 'auto';
                    subitem.style.opacity = '1';
                    setLucideIcon(subitem, 'book-open-check');
                }
            } else if (isUnlocked) {
                // Estado: DESBLOQUEADO (EM ANDAMENTO / A FAZER)
                if (card) card.classList.add('highlight-module');
                if (badge) {
                    badge.className = 'module-status-badge hot';
                    badge.innerHTML = '<i data-lucide="sparkles"></i> Iniciar';
                }
                if (btn) {
                    btn.className = 'btn btn-accent btn-sm mt-auto';
                    btn.textContent = 'Iniciar Aula';
                    btn.style.pointerEvents = 'auto';
                }
                if (subitem) {
                    subitem.style.pointerEvents = 'auto';
                    subitem.style.opacity = '1';
                    setLucideIcon(subitem, 'book-open');
                }
            } else {
                // Estado: BLOQUEADO
                if (badge) {
                    badge.className = 'module-status-badge pending';
                    badge.innerHTML = '<i data-lucide="lock"></i> Bloqueado';
                }
                if (btn) {
                    btn.className = 'btn btn-outline btn-sm mt-auto';
                    btn.textContent = 'Bloqueado';
                    btn.style.pointerEvents = 'none'; // desabilita cliques
                }
                if (subitem) {
                    subitem.style.pointerEvents = 'none';
                    subitem.style.opacity = '0.4';
                    setLucideIcon(subitem, 'lock');
                }
            }
        };

        // Regra de negócios para habilitar as dependências sequenciais:
        // Módulo 1: Sempre liberado
        updateCardAndSubitem(1, true, states.mod1, "index.html", "Sistemas");
        
        // Módulo 2: Requer Módulo 1
        updateCardAndSubitem(2, states.mod1, states.mod2, "modulo2.html", "Dados");
        
        // Módulo 3: Requer Módulo 2
        updateCardAndSubitem(3, states.mod2, states.mod3, "modulo3.html", "Caos");
        
        // Módulo 4: Requer Módulo 3
        updateCardAndSubitem(4, states.mod3, states.mod4, "modulo4.html", "MuleSoft");
        
        // Módulo 5: Requer Módulo 4
        updateCardAndSubitem(5, states.mod4, states.mod5, "modulo5.html", "Projeto");

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Rolar para módulos
    const btnStartJourney = document.getElementById('btn-start-journey');
    if (btnStartJourney) {
        btnStartJourney.addEventListener('click', () => {
            const modulesSection = document.getElementById('modules');
            if (modulesSection) {
                modulesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Inicialização da plataforma
    renderDashboardProgress();
});
