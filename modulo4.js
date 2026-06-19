// ==========================================================================
// MÓDULO 4 - MULESOFT COMO SOLUÇÃO - JAVASCRIPT PRINCIPAL
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       1. SISTEMA DE NAVEGAÇÃO E PROGRESSO
       ========================================================================== */
    const sections = document.querySelectorAll('.chapter-section');
    const stepBtns = document.querySelectorAll('.step-btn');
    const progressFill = document.getElementById('progress-fill');
    const sectionIds = ['hero', 'o-problema', 'o-hub', 'simulador-hub', 'vantagens', 'conclusao'];

    const scrollToSection = (targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Cliques nos passos superiores
    stepBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            scrollToSection(targetId);
        });
    });

    // Cliques nos botões de avançar no rodapé
    document.querySelectorAll('.next-section-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-next');
            scrollToSection(targetId);
        });
    });

    // Botão de início na seção Hero
    const startLessonBtn = document.getElementById('btn-start-lesson');
    if (startLessonBtn) {
        startLessonBtn.addEventListener('click', () => {
            scrollToSection('o-problema');
        });
    }

    // Atualiza progresso superior
    const updateActiveStep = (targetId) => {
        const activeIndex = sectionIds.indexOf(targetId);
        if (activeIndex === -1) return;

        stepBtns.forEach((btn, idx) => {
            btn.classList.remove('active', 'completed');
            if (idx === activeIndex) {
                btn.classList.add('active');
            } else if (idx < activeIndex) {
                btn.classList.add('completed');
            }
        });

        const progressPercent = (activeIndex / (sectionIds.length - 1)) * 100;
        progressFill.style.width = `${progressPercent}%`;
    };

    // Intersection Observer para rastrear a rolagem
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveStep(entry.target.id);
                // Salva progresso ao chegar na conclusão
                if (entry.target.id === 'conclusao') {
                    localStorage.setItem('muleacademy_completed_4', 'true');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));


    /* ==========================================================================
       2. SIMULADOR SANDBOX MULESOFT (CHAPTER 3)
       ========================================================================== */
    const hubSvgCanvas = document.getElementById('hub-svg-canvas');
    const hubDropZone = document.getElementById('hub-drop-zone');
    const dragCards = document.querySelectorAll('.drag-card');
    const btnConnectList = document.querySelectorAll('.btn-connect');
    const btnResetHub = document.getElementById('btn-reset-hub');

    const hubSystemsCount = document.getElementById('hub-systems-count');
    const hubP2pCount = document.getElementById('hub-p2p-count');
    const hubActualCount = document.getElementById('hub-actual-count');
    const hubFeedbackText = document.getElementById('hub-feedback-text');
    const hubFeedbackAlert = document.getElementById('hub-feedback-alert');
    const hubExplanationText = document.getElementById('hub-explanation-text');
    const hubExplanationBox = document.getElementById('hub-explanation-box');

    // Metadados dos 5 sistemas
    const systemMetadata = {
        crm: { id: "crm", name: "CRM", desc: "Salesforce CRM", color: "var(--color-teal)", text: "MuleSoft converte cadastros JSON do Salesforce para outros sistemas." },
        db: { id: "db", name: "Banco", desc: "MySQL Database", color: "var(--color-indigo)", text: "MuleSoft insere registros de vendas de forma segura via queries SQL nativas." },
        erp: { id: "erp", name: "ERP", desc: "Faturamento ERP", color: "var(--color-rose)", text: "MuleSoft gera os arquivos XML de NFe exigidos pelo faturamento e os envia." },
        shop: { id: "shop", name: "Shopify", desc: "Shopify Store", color: "var(--color-json)", text: "MuleSoft captura eventos de novos pedidos JSON da loja em tempo real." },
        pay: { id: "pay", name: "Pagam.", desc: "Gateway API", color: "var(--color-csv)", text: "MuleSoft envia dados de cobrança consolidados de pagamentos via REST." }
    };

    // Estado das conexões
    let connectedSystems = {
        crm: false,
        db: false,
        erp: false,
        shop: false,
        pay: false
    };

    const centerX = 200;
    const centerY = 200;
    const radius = 130;
    const keys = Object.keys(systemMetadata);

    // Inicialização e Renderização Estática dos Nós Vazios
    const renderBaseNodes = () => {
        if (!hubSvgCanvas) return;

        // Limpa tudo menos o Hub Central
        const centerNode = document.getElementById('mulesoft-hub-node');
        hubSvgCanvas.innerHTML = '';
        if (centerNode) {
            hubSvgCanvas.appendChild(centerNode);
        }

        // Desenha os 5 nós em círculo (desconectados)
        keys.forEach((key, idx) => {
            const angle = (2 * Math.PI * idx) / keys.length - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("id", `node-group-${key}`);
            group.setAttribute("class", "hub-node-group");

            // Círculo base (tracejado cinza)
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", "20");
            circle.setAttribute("fill", "#04060c");
            circle.setAttribute("stroke", "#334155"); // cinza desativado
            circle.setAttribute("stroke-width", "2");
            circle.setAttribute("stroke-dasharray", "4,4");
            circle.setAttribute("id", `node-circle-${key}`);

            // Texto
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x);
            text.setAttribute("y", y + 4);
            text.setAttribute("fill", "#475569");
            text.setAttribute("font-family", "Outfit");
            text.setAttribute("font-size", "9");
            text.setAttribute("font-weight", "600");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("id", `node-text-${key}`);
            text.textContent = systemMetadata[key].name;

            group.appendChild(circle);
            group.appendChild(text);
            hubSvgCanvas.appendChild(group);
        });
    };

    // Conectar um sistema específico
    const connectSystem = (systemKey) => {
        if (connectedSystems[systemKey]) return; // já conectado

        connectedSystems[systemKey] = true;

        // 1. Atualizar visual do card lateral
        const card = document.getElementById(`drag-${systemKey}`);
        if (card) {
            card.classList.add('connected');
            const btn = card.querySelector('.btn-connect');
            if (btn) {
                btn.textContent = 'Conectado';
                btn.disabled = true;
            }
        }

        // 2. Acender nó no SVG
        const circle = document.getElementById(`node-circle-${systemKey}`);
        const text = document.getElementById(`node-text-${systemKey}`);
        const meta = systemMetadata[systemKey];

        if (circle && text) {
            circle.setAttribute("stroke", meta.color);
            circle.setAttribute("stroke-width", "3");
            circle.removeAttribute("stroke-dasharray");
            circle.setAttribute("fill", "#0c1020");
            text.setAttribute("fill", "#ffffff");
        }

        // 3. Desenhar a conexão com o centro (MuleSoft)
        const nodeIdx = keys.indexOf(systemKey);
        const angle = (2 * Math.PI * nodeIdx) / keys.length - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Linha de Conexão
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x);
        line.setAttribute("y1", y);
        line.setAttribute("x2", centerX);
        line.setAttribute("y2", centerY);
        line.setAttribute("class", "hub-line-glow");
        line.setAttribute("id", `line-${systemKey}`);
        // Insere antes do nó central para a linha ficar atrás dele
        const centerNode = document.getElementById('mulesoft-hub-node');
        hubSvgCanvas.insertBefore(line, centerNode);

        // Fluxo de Partícula usando animateMotion
        // Para isso, criamos um path invisível ligando o sistema ao centro
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${x},${y} L ${centerX},${centerY}`);
        path.setAttribute("id", `path-flow-${systemKey}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "none");
        hubSvgCanvas.appendChild(path);

        // Círculo animado
        const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        particle.setAttribute("r", "3.5");
        particle.setAttribute("class", "data-flow-particle");
        particle.setAttribute("id", `particle-${systemKey}`);

        const animateMotion = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        animateMotion.setAttribute("dur", "1.8s");
        animateMotion.setAttribute("repeatCount", "indefinite");
        
        // Direção alternada baseada no idx para fluxo mais dinâmico
        if (nodeIdx % 2 === 0) {
            animateMotion.setAttribute("path", `M ${x},${y} L ${centerX},${centerY}`);
        } else {
            animateMotion.setAttribute("path", `M ${centerX},${centerY} L ${x},${y}`);
        }
        
        particle.appendChild(animateMotion);
        hubSvgCanvas.appendChild(particle);

        // 4. Adiciona listeners de hover no grupo do nó aceso
        const group = document.getElementById(`node-group-${systemKey}`);
        if (group) {
            group.addEventListener('mouseenter', () => {
                group.setAttribute("transform", `scale(1.1) translate(${-x * 0.1}, ${-y * 0.1})`);
                hubExplanationText.innerHTML = `<strong>${meta.desc} Conectado:</strong> ${meta.text}`;
                hubExplanationBox.className = 'hover-connection-explanation connected-active';
                
                // Destaca a linha
                line.style.strokeWidth = "5px";
                line.style.stroke = "var(--color-teal-light)";
            });

            group.addEventListener('mouseleave', () => {
                group.setAttribute("transform", "none");
                hubExplanationText.textContent = "Passe o mouse por cima de um sistema conectado para entender sua tradução!";
                hubExplanationBox.className = 'hover-connection-explanation';
                
                // Reseta linha
                line.style.strokeWidth = "2.5px";
                line.style.stroke = "var(--color-indigo)";
            });
        }

        // 5. Atualizar métricas
        updateEcosystemMetrics();
    };

    // Atualização de Estatísticas e Feedback
    const updateEcosystemMetrics = () => {
        let connectedCount = 0;
        keys.forEach(k => {
            if (connectedSystems[k]) connectedCount++;
        });

        hubSystemsCount.textContent = connectedCount;
        hubActualCount.textContent = connectedCount;

        // Fórmula ponto a ponto: N(N-1)/2
        const p2pCount = (connectedCount * (connectedCount - 1)) / 2;
        hubP2pCount.textContent = p2pCount;

        // Altera feedback box
        if (connectedCount === 0) {
            hubFeedbackText.textContent = "Arraste um sistema para o centro do MuleSoft ou clique em Conectar para iniciar!";
            setFeedbackIcon('info', 'text-indigo-light');
        } else if (connectedCount < 3) {
            hubFeedbackText.innerHTML = `<strong>Tudo limpo!</strong> ${connectedCount} sistemas conectados com apenas ${connectedCount} cabos. Sem espaguete até aqui.`;
            setFeedbackIcon('smile', 'text-teal');
        } else if (connectedCount < 5) {
            hubFeedbackText.innerHTML = `<strong>Excelente!</strong> Se fosse ponto a ponto, você já precisaria de ${p2pCount} remendos. Usando o Hub MuleSoft, você tem apenas ${connectedCount} conexões organizadas.`;
            setFeedbackIcon('zap', 'text-teal');
        } else {
            hubFeedbackText.innerHTML = `<strong>Ecossistema Completo!</strong> 5 sistemas rodando em harmonia. Você evitou 10 conexões manuais redundantes! Integrar novos canais agora leva minutos, não semanas.`;
            setFeedbackIcon('check-circle', 'text-emerald');
        }
    };

    const setFeedbackIcon = (iconName, colorClass) => {
        const iconEl = hubFeedbackAlert.querySelector('i') || hubFeedbackAlert.querySelector('svg');
        if (iconEl) {
            const newIcon = document.createElement('i');
            newIcon.setAttribute('data-lucide', iconName);
            newIcon.className = `err-alert-icon ${colorClass}`;
            iconEl.replaceWith(newIcon);
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    };

    // Reseta todo o ecossistema
    const resetHub = () => {
        keys.forEach(k => {
            connectedSystems[k] = false;
            
            // Limpa visual dos cards
            const card = document.getElementById(`drag-${k}`);
            if (card) {
                card.classList.remove('connected');
                const btn = card.querySelector('.btn-connect');
                if (btn) {
                    btn.textContent = 'Conectar';
                    btn.disabled = false;
                }
            }
        });

        renderBaseNodes();
        updateEcosystemMetrics();
        hubExplanationText.textContent = "Passe o mouse por cima de um sistema conectado para entender sua tradução!";
        hubExplanationBox.className = 'hover-connection-explanation';
    };

    if (btnResetHub) {
        btnResetHub.addEventListener('click', resetHub);
    }

    // Ações dos botões de clique rápido "Conectar"
    btnConnectList.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const systemKey = e.currentTarget.getAttribute('data-connect');
            connectSystem(systemKey);
        });
    });


    /* ==========================================================================
       3. DRAG AND DROP (ARRASTAR E SOLTAR)
       ========================================================================== */
    dragCards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            const systemKey = card.getAttribute('data-system');
            e.dataTransfer.setData('text/plain', systemKey);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    });

    if (hubDropZone) {
        hubDropZone.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessário para permitir o drop
            hubDropZone.classList.add('drag-over');
        });

        hubDropZone.addEventListener('dragleave', () => {
            hubDropZone.classList.remove('drag-over');
        });

        hubDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            hubDropZone.classList.remove('drag-over');
            
            const systemKey = e.dataTransfer.getData('text/plain');
            if (systemKey && systemMetadata[systemKey]) {
                connectSystem(systemKey);
            }
        });
    }

    // Inicializa renderização base
    renderBaseNodes();
    updateEcosystemMetrics();


    /* ==========================================================================
       4. CONCLUSÃO DO MÓDULO E REDIRECIONAMENTO
       ========================================================================== */
    const btnNextModule = document.getElementById('btn-next-module');
    if (btnNextModule) {
        btnNextModule.addEventListener('click', () => {
            localStorage.setItem('muleacademy_completed_4', 'true');
            // Redireciona diretamente para o Módulo 5 (Projeto Prático)
            window.location.href = "modulo5.html";
        });
    }
});
