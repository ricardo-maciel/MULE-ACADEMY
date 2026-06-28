// ==========================================================================
// DASHBOARD DO CURSO - ESTADO DINÂMICO DE PROGRESSO E MÓDULOS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Carrega dados do usuário logado de forma segura contra erros de parseamento
    let currentUser = null;
    try {
        currentUser = JSON.parse(sessionStorage.getItem('muleacademy_current_user'));
    } catch (e) {
        console.error("Erro ao fazer o parse do usuário logado:", e);
        const rawUser = sessionStorage.getItem('muleacademy_current_user');
        if (rawUser) {
            currentUser = { name: rawUser, email: '' };
        }
    }

    if (currentUser) {
        const profileNameEl = document.getElementById('profile-user-name');
        if (profileNameEl) {
            profileNameEl.textContent = currentUser.name;
        }
    }

    // Configura botão de logout no sidebar
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm('Deseja realmente sair da sua conta?')) {
                // Fazer backup do progresso do aluno antes de sair
                if (currentUser && currentUser.email !== 'admin@curso.com') {
                    saveStudentProgressBackup(currentUser.email);
                }
                sessionStorage.removeItem('muleacademy_current_user');
                window.location.href = 'login.html';
            }
        });
    }

    // Função para salvar backup de progresso do aluno no localstorage
    function saveStudentProgressBackup(email) {
        const backupKey = `muleacademy_progress_${email}`;
        let backupStr = '';
        for (let i = 1; i <= 5; i++) {
            const completed = localStorage.getItem(`muleacademy_completed_${i}`);
            if (completed === 'true') {
                backupStr += `muleacademy_completed_${i}=true;`;
            }
        }
        const completedDados = localStorage.getItem('muleacademy_completed_dados');
        if (completedDados === 'true') {
            backupStr += 'muleacademy_completed_dados=true;';
        }
        if (backupStr) {
            localStorage.setItem(backupKey, backupStr);
        }
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
            mod5: localStorage.getItem('muleacademy_completed_5') === 'true',
            mod2_completed: localStorage.getItem('muleacademy_completed_dados') === 'true'
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

        // Admin bypass: liberar tudo sem bloqueio
        const isAdmin = currentUser && currentUser.email === 'admin@curso.com';
        
        // Módulo 1 progress
        let completedCount = 0;
        if (states.mod1) completedCount++;
        if (states.mod2) completedCount++;
        if (states.mod3) completedCount++;
        if (states.mod4) completedCount++;
        if (states.mod5) completedCount++;

        // Atualizar papel/nível no rodapé do perfil
        const profileRoleEl = document.getElementById('profile-user-role');
        if (profileRoleEl) {
            if (currentUser && currentUser.email === 'admin@curso.com') {
                profileRoleEl.textContent = 'Admin 👑';
            } else if (completedCount === 5 && states.mod2_completed) {
                profileRoleEl.textContent = 'Graduado Master 🎓';
            } else if (completedCount === 5) {
                profileRoleEl.textContent = 'Graduado Módulo 1 🎓';
            } else {
                profileRoleEl.textContent = `Nível ${completedCount + 1}`;
            }
        }

        // 1. Atualizar progresso do Módulo 1
        const radialFillMod1 = document.getElementById('radial-progress-fill-mod1');
        const progressTextMod1 = document.getElementById('progress-text-mod1');
        const progressDescMod1 = document.getElementById('progress-desc-mod1');
        
        const percentMod1 = (completedCount / 5) * 100;
        if (progressTextMod1) progressTextMod1.textContent = `${percentMod1}%`;
        if (progressDescMod1) progressDescMod1.textContent = `${completedCount} de 5 Aulas concluídas`;

        const totalCircumference = 251.2;
        const dashoffsetMod1 = totalCircumference - (totalCircumference * (completedCount / 5));
        if (radialFillMod1) {
            radialFillMod1.style.strokeDasharray = `${totalCircumference}`;
            radialFillMod1.style.strokeDashoffset = `${dashoffsetMod1}`;
        }

        // 2. Atualizar progresso do Módulo 2
        const radialFillMod2 = document.getElementById('radial-progress-fill-mod2');
        const progressTextMod2 = document.getElementById('progress-text-mod2');
        const progressDescMod2 = document.getElementById('progress-desc-mod2');
        const isMod2Completed = states.mod2_completed;
        const completedCount2 = isMod2Completed ? 3 : 0;
        const percentMod2 = isMod2Completed ? 100 : 0;

        if (progressTextMod2) progressTextMod2.textContent = `${percentMod2}%`;
        if (progressDescMod2) progressDescMod2.textContent = `${completedCount2} de 3 Aulas concluídas`;

        const dashoffsetMod2 = totalCircumference - (totalCircumference * (isMod2Completed ? 1 : 0));
        if (radialFillMod2) {
            radialFillMod2.style.strokeDasharray = `${totalCircumference}`;
            radialFillMod2.style.strokeDashoffset = `${dashoffsetMod2}`;
        }

        // 3. Controlar o botão CTA principal no rodapé (Footer CTA)
        const footerCountText = document.getElementById('footer-modules-count');
        const footerBtn = document.getElementById('btn-footer-continue');
        const progressSummary = document.getElementById('progress-summary');
        
        // Mostrar o rodapé de progresso apenas para o Aluno (esconder para Admin)
        if (progressSummary) {
            if (isAdmin) {
                progressSummary.style.display = 'none';
            } else {
                progressSummary.style.display = 'block';
            }
        }
        
        const totalCompleted = completedCount + completedCount2;
        if (footerCountText) footerCountText.textContent = `${totalCompleted} / 8`;
        if (footerBtn) {
            if (completedCount === 0) {
                footerBtn.innerHTML = '<span>Iniciar Aula 1</span><i data-lucide="arrow-right"></i>';
                footerBtn.onclick = () => window.location.href = "index.html";
            } else if (completedCount === 1) {
                footerBtn.innerHTML = '<span>Iniciar Aula 2</span><i data-lucide="arrow-right"></i>';
                footerBtn.onclick = () => window.location.href = "modulo2.html";
            } else if (completedCount === 2) {
                footerBtn.innerHTML = '<span>Iniciar Aula 3</span><i data-lucide="arrow-right"></i>';
                footerBtn.onclick = () => window.location.href = "modulo3.html";
            } else if (completedCount === 3) {
                footerBtn.innerHTML = '<span>Iniciar Aula 4</span><i data-lucide="arrow-right"></i>';
                footerBtn.onclick = () => window.location.href = "modulo4.html";
            } else if (completedCount === 4) {
                footerBtn.innerHTML = '<span>Iniciar Aula 5</span><i data-lucide="arrow-right"></i>';
                footerBtn.onclick = () => window.location.href = "modulo5.html";
            } else if (completedCount === 5) {
                if (isMod2Completed) {
                    footerBtn.innerHTML = '<span>Parabéns! Curso Concluído 🎓</span>';
                    footerBtn.classList.replace('btn-accent', 'btn-primary');
                    footerBtn.onclick = null;
                } else {
                    footerBtn.innerHTML = '<span>Iniciar Módulo 2</span><i data-lucide="arrow-right"></i>';
                    footerBtn.classList.replace('btn-primary', 'btn-accent');
                    footerBtn.onclick = () => window.location.href = "dados.html";
                }
            }
        }

        // 4. Atualizar cada um dos cards de Módulo (Desbloqueados vs Bloqueados)
        const updateCardAndSubitem = (modNum, isUnlocked, isCompleted, pageUrl, badgeName) => {
            const card = document.getElementById(`card-mod${modNum}`);
            const badge = document.getElementById(`badge-mod${modNum}`);
            const btn = document.getElementById(`btn-mod${modNum}`);
            const subitem = document.getElementById(`nav-sub-mod${modNum}`);

            if (card) {
                card.classList.remove('completed-module', 'highlight-module');
            }

            if (isCompleted) {
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
                if (badge) {
                    badge.className = 'module-status-badge pending';
                    badge.innerHTML = '<i data-lucide="lock"></i> Bloqueado';
                }
                if (btn) {
                    btn.className = 'btn btn-outline btn-sm mt-auto';
                    btn.textContent = 'Bloqueado';
                    btn.style.pointerEvents = 'none';
                }
                if (subitem) {
                    subitem.style.pointerEvents = 'none';
                    subitem.style.opacity = '0.4';
                    setLucideIcon(subitem, 'lock');
                }
            }
        };

        // Regra de negócios para habilitar as dependências sequenciais Módulo 1
        // Admin ignora o bloqueio sequencial: isUnlocked sempre true
        updateCardAndSubitem(1, true,                          states.mod1, "index.html",    "Sistemas");
        updateCardAndSubitem(2, isAdmin || states.mod1,        states.mod2, "modulo2.html",  "Dados");
        updateCardAndSubitem(3, isAdmin || states.mod2,        states.mod3, "modulo3.html",  "Caos");
        updateCardAndSubitem(4, isAdmin || states.mod3,        states.mod4, "modulo4.html",  "MuleSoft");
        updateCardAndSubitem(5, isAdmin || states.mod4,        states.mod5, "modulo5.html",  "Projeto");

        // Regra de negócios para Módulo 2
        const isMod1FullyCompleted = isAdmin ||
            (states.mod1 && states.mod2 && states.mod3 && states.mod4 && states.mod5);

        // IDs dos 3 cards de aula do Módulo 2
        const dadosCards = [
            { card: 'card-dados-1', badge: 'badge-dados-1', btn: 'btn-dados-1', href: 'dados.html#stage1' },
            { card: 'card-dados-2', badge: 'badge-dados-2', btn: 'btn-dados-2', href: 'dados.html#stage3' },
            { card: 'card-dados-3', badge: 'badge-dados-3', btn: 'btn-dados-3', href: 'dados.html#stage4' }
        ];

        // Sidebar sub-items do Módulo 2
        const subitemsMod2 = [
            document.getElementById('nav-sub-dataflow-1'),
            document.getElementById('nav-sub-dataflow-2'),
            document.getElementById('nav-sub-dataflow-3')
        ];

        dadosCards.forEach(({ card: cardId, badge: badgeId, btn: btnId, href }) => {
            const card  = document.getElementById(cardId);
            const badge = document.getElementById(badgeId);
            const btn   = document.getElementById(btnId);

            if (card) card.classList.remove('completed-module', 'highlight-module');

            if (isMod2Completed) {
                if (card)  card.classList.add('completed-module');
                if (badge) { badge.className = 'module-status-badge'; badge.innerHTML = '<i data-lucide="check-circle" class="text-emerald"></i> Concluído'; }
                if (btn)   { btn.className = 'btn btn-outline btn-sm mt-auto'; btn.textContent = 'Rever'; btn.href = href; btn.style.pointerEvents = 'auto'; }
            } else if (isMod1FullyCompleted) {
                if (card)  card.classList.add('highlight-module');
                if (badge) { badge.className = 'module-status-badge hot'; badge.innerHTML = '<i data-lucide="sparkles"></i> Iniciar'; }
                if (btn)   { btn.className = 'btn btn-accent btn-sm mt-auto'; btn.textContent = 'Iniciar Aula'; btn.href = href; btn.style.pointerEvents = 'auto'; }
            } else {
                if (badge) { badge.className = 'module-status-badge pending'; badge.innerHTML = '<i data-lucide="lock"></i> Bloqueado'; }
                if (btn)   { btn.className = 'btn btn-outline btn-sm mt-auto'; btn.textContent = 'Bloqueado'; btn.style.pointerEvents = 'none'; }
            }
        });

        // Atualizar sidebar subitems do Módulo 2
        subitemsMod2.forEach(subitem => {
            if (subitem) {
                if (isMod2Completed) {
                    subitem.style.pointerEvents = 'auto'; subitem.style.opacity = '1';
                    setLucideIcon(subitem, 'book-open-check');
                } else if (isMod1FullyCompleted) {
                    subitem.style.pointerEvents = 'auto'; subitem.style.opacity = '1';
                    setLucideIcon(subitem, 'book-open');
                } else {
                    subitem.style.pointerEvents = 'none'; subitem.style.opacity = '0.4';
                    setLucideIcon(subitem, 'lock');
                }
            }
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Lógica para toggle dos acordeões de Aulas no Painel
    const setupAccordions = () => {
        const toggleButtons = document.querySelectorAll('.btn-toggle-lessons');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const grid = document.getElementById(targetId);
                if (grid) {
                    const isHidden = grid.classList.toggle('hidden');
                    btn.querySelector('span').textContent = isHidden ? 'Mostrar Aulas' : 'Esconder Aulas';
                    const icon = btn.querySelector('i') || btn.querySelector('svg');
                    if (icon) {
                        const newIcon = document.createElement('i');
                        newIcon.setAttribute('data-lucide', isHidden ? 'eye' : 'eye-off');
                        icon.replaceWith(newIcon);
                    }
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        });
    };
    setupAccordions();

    // Lógica para toggle dos acordeões de Aulas no Sidebar
    const setupSidebarAccordion = () => {
        const toggleButtons = document.querySelectorAll('.btn-toggle-sidebar-subitems');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetId = btn.getAttribute('data-target');
                const subitems = document.getElementById(targetId);
                if (subitems) {
                    const isHidden = subitems.classList.toggle('hidden');
                    btn.classList.toggle('rotated', !isHidden);
                    
                    const icon = btn.querySelector('i') || btn.querySelector('svg');
                    if (icon) {
                        const newIcon = document.createElement('i');
                        newIcon.setAttribute('data-lucide', isHidden ? 'chevron-down' : 'chevron-up');
                        icon.replaceWith(newIcon);
                    }
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        });
    };
    setupSidebarAccordion();

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

    // Resets de Progresso por Módulo
    const btnResetCourse = document.getElementById('btn-reset-course');
    const btnResetModulo2 = document.getElementById('btn-reset-modulo2');
    const btnResetSidebar = document.getElementById('btn-reset-sidebar');

    if (btnResetCourse) {
        btnResetCourse.addEventListener('click', () => {
            if (confirm('Deseja realmente resetar todo o progresso do Módulo 1? Todas as suas aulas serão marcadas como pendentes.')) {
                localStorage.removeItem('muleacademy_completed_1');
                localStorage.removeItem('muleacademy_completed_2');
                localStorage.removeItem('muleacademy_completed_3');
                localStorage.removeItem('muleacademy_completed_4');
                localStorage.removeItem('muleacademy_completed_5');
                window.location.reload();
            }
        });
    }

    if (btnResetModulo2) {
        btnResetModulo2.addEventListener('click', () => {
            if (confirm('Deseja realmente resetar todo o progresso do Módulo 2? Seu simulador e quiz serão zerados.')) {
                localStorage.removeItem('muleacademy_completed_dados');
                window.location.reload();
            }
        });
    }

    if (btnResetSidebar) {
        btnResetSidebar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Deseja realmente resetar todo o progresso da plataforma (Módulo 1 e Módulo 2)?')) {
                localStorage.removeItem('muleacademy_completed_1');
                localStorage.removeItem('muleacademy_completed_2');
                localStorage.removeItem('muleacademy_completed_3');
                localStorage.removeItem('muleacademy_completed_4');
                localStorage.removeItem('muleacademy_completed_5');
                localStorage.removeItem('muleacademy_completed_dados');
                window.location.reload();
            }
        });
    }

    // Lógica para toggle do menu lateral no mobile
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (mobileToggle && sidebar && overlay) {
        const toggleMenu = () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        };

        mobileToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        sidebar.querySelectorAll('.nav-item, .nav-subitem').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
            });
        });
    }

    // Inicialização da plataforma
    renderDashboardProgress();
});
