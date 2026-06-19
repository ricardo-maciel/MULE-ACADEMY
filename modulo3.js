// ==========================================================================
// MÓDULO 3 - O CAOS DO ESPAGUETE - JAVASCRIPT PRINCIPAL
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
    const sectionIds = ['hero', 'ilusao-inicial', 'complexidade-cresce', 'explosao-caos', 'simulador-caos', 'consequencias', 'conclusao'];

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

    // Cliques nos botões de avançar no rodapé de cada capítulo
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
            scrollToSection('ilusao-inicial');
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
                    localStorage.setItem('muleacademy_completed_3', 'true');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));


    /* ==========================================================================
       2. DIAGRAMA DE SPAGHETTI ESTÁTICO (CAPÍTULO 3 - EXPLOSÃO CAOS)
       ========================================================================== */
    const staticSpaghettiSvg = document.getElementById('static-spaghetti-svg');
    if (staticSpaghettiSvg) {
        const staticSystemsCount = 10;
        const centerX = 170;
        const centerY = 170;
        const radius = 130;
        const staticNodes = [];

        // Calcula posições dos 10 nós em círculo
        for (let i = 0; i < staticSystemsCount; i++) {
            const angle = (2 * Math.PI * i) / staticSystemsCount - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            staticNodes.push({ x, y });
        }

        // Desenha todas as 45 conexões cruzadas
        for (let i = 0; i < staticSystemsCount; i++) {
            for (let j = i + 1; j < staticSystemsCount; j++) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", staticNodes[i].x);
                line.setAttribute("y1", staticNodes[i].y);
                line.setAttribute("x2", staticNodes[j].x);
                line.setAttribute("y2", staticNodes[j].y);
                line.setAttribute("stroke", "var(--color-rose)");
                line.setAttribute("stroke-opacity", "0.45");
                line.setAttribute("stroke-width", "1");
                staticSpaghettiSvg.appendChild(line);
            }
        }

        // Desenha os círculos dos 10 nós
        staticNodes.forEach((node, idx) => {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", node.x);
            circle.setAttribute("cy", node.y);
            circle.setAttribute("r", "12");
            circle.setAttribute("fill", "#04060c");
            circle.setAttribute("stroke", "var(--color-rose-light)");
            circle.setAttribute("stroke-width", "2");
            staticSpaghettiSvg.appendChild(circle);
        });
    }


    /* ==========================================================================
       3. SIMULADOR DE CAOS INTERATIVO (CHAPTER 4)
       ========================================================================== */
    const interactiveSpaghettiSvg = document.getElementById('interactive-spaghetti-svg');
    const btnAddSystem = document.getElementById('btn-add-system');
    const btnResetSimulator = document.getElementById('btn-reset-simulator');
    const btnPreset2 = document.getElementById('btn-preset-2');
    const btnPreset5 = document.getElementById('btn-preset-5');
    const btnPreset10 = document.getElementById('btn-preset-10');

    const metricSystemsCount = document.getElementById('metric-systems-count');
    const metricConnectionsCount = document.getElementById('metric-connections-count');
    const metricStressLevel = document.getElementById('metric-stress-level');
    const simulatorFeedbackAlert = document.getElementById('simulator-feedback-alert');
    const simulatorFeedbackText = document.getElementById('simulator-feedback-text');
    const alarmGlow = document.getElementById('alarm-glow');
    const connectionExplanationText = document.getElementById('connection-explanation-text');
    const connectionExplanationIcon = document.getElementById('connection-explanation').querySelector('i');

    let currentSystemCount = 2;

    const systemMetadata = [
        { name: "Loja", desc: "Loja Virtual (Website)", color: "var(--color-indigo)" },
        { name: "Banco", desc: "Banco de Dados Central SQL", color: "var(--color-accent)" },
        { name: "CRM", desc: "Salesforce (Gestão de Clientes)", color: "var(--color-teal)" },
        { name: "Logist.", desc: "Transportadora & Fretes API", color: "var(--color-json)" },
        { name: "Fatur.", desc: "ERP de Notas Fiscais (XML)", color: "var(--color-rose)" },
        { name: "Estoc.", desc: "Controle de Inventário WMS", color: "#38bdf8" },
        { name: "Pagam.", desc: "Gateway de Cartões de Crédito", color: "#eab308" },
        { name: "Mobile", desc: "App iOS / Android Nativo", color: "#ec4899" },
        { name: "Fornec.", desc: "API de Distribuidores Externos", color: "#a855f7" },
        { name: "BI", desc: "Painel de Business Intelligence", color: "#10b981" },
        { name: "SAC", desc: "Plataforma de Suporte & Chat", color: "#f97316" },
        { name: "Mark.", desc: "Hub de Disparo de E-mails", color: "#6366f1" }
    ];

    const integrationDetails = [
        "Script Python customizado via SSH.",
        "Trigger de BD manual copiando registros.",
        "Integração via SOAP antiga convertendo para JSON.",
        "Arquivo CSV exportado por e-mail automaticamente às 23h.",
        "Conexão direta HTTP sem criptografia.",
        "Pasta FTP compartilhada lendo arquivos text.",
        "Script legado em PHP corrigindo cabeçalhos.",
        "Remendo manual no banco duplicando chaves.",
        "Rotina cron que falha se receber nulo.",
        "API customizada sem documentação oficial.",
        "WebService legado feito por consultoria externa."
    ];

    // Desenha o ecossistema na tela
    const renderInteractiveSpaghetti = () => {
        if (!interactiveSpaghettiSvg) return;

        // Limpa desenhos anteriores
        interactiveSpaghettiSvg.innerHTML = '';

        const centerX = 200;
        const centerY = 200;
        const radius = 135;
        const nodes = [];

        // Calcula posições de acordo com o número atual de nós
        for (let i = 0; i < currentSystemCount; i++) {
            const angle = (2 * Math.PI * i) / currentSystemCount - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            nodes.push({
                x,
                y,
                name: systemMetadata[i].name,
                desc: systemMetadata[i].desc,
                color: systemMetadata[i].color
            });
        }

        const isChaos = currentSystemCount >= 9;
        const isWarning = currentSystemCount >= 5 && currentSystemCount <= 8;

        // 1. Desenha as linhas primeiro (para ficarem por baixo dos nós)
        const drawnLines = [];
        for (let i = 0; i < currentSystemCount; i++) {
            for (let j = i + 1; j < currentSystemCount; j++) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", nodes[i].x);
                line.setAttribute("y1", nodes[i].y);
                line.setAttribute("x2", nodes[j].x);
                line.setAttribute("y2", nodes[j].y);
                
                // Cor da linha muda conforme o estresse
                let strokeColor = "rgba(20, 184, 166, 0.4)"; // Verde estável
                if (isChaos) {
                    strokeColor = "rgba(244, 63, 94, 0.55)"; // Vermelho caos
                    line.setAttribute("class", "spaghetti-line chaos-line");
                } else if (isWarning) {
                    strokeColor = "rgba(249, 115, 22, 0.5)"; // Laranja aviso
                    line.setAttribute("class", "spaghetti-line");
                } else {
                    line.setAttribute("class", "spaghetti-line");
                }

                line.setAttribute("stroke", strokeColor);
                line.setAttribute("stroke-width", "2");

                // Mapeia detalhes para o hover
                const sysA = nodes[i].name;
                const sysB = nodes[j].name;
                const techDetail = integrationDetails[(i * 3 + j) % integrationDetails.length];

                line.addEventListener('mouseenter', () => {
                    line.classList.add('hovered');
                    connectionExplanationText.innerHTML = `<strong>Conexão ${sysA} &harr; ${sysB}</strong>: ${techDetail}`;
                    document.getElementById('connection-explanation').className = `hover-connection-explanation ${isChaos ? 'stress-high' : ''}`;
                });

                line.addEventListener('mouseleave', () => {
                    line.classList.remove('hovered');
                    connectionExplanationText.textContent = "Passe o mouse por cima de uma conexão ou nó do diagrama para ver a infraestrutura interna!";
                    document.getElementById('connection-explanation').className = "hover-connection-explanation";
                });

                interactiveSpaghettiSvg.appendChild(line);
                drawnLines.push({ element: line, from: i, to: j });
            }
        }

        // 2. Desenha os nós
        nodes.forEach((node, idx) => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            
            if (isChaos) {
                group.setAttribute("class", "spaghetti-node-group chaos-node");
            } else {
                group.setAttribute("class", "spaghetti-node-group");
            }

            // Círculo principal do nó
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", node.x);
            circle.setAttribute("cy", node.y);
            circle.setAttribute("r", "20");
            circle.setAttribute("fill", "#04060c");
            circle.setAttribute("stroke", node.color);
            circle.setAttribute("stroke-width", "2");

            // Texto com abreviação
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", node.x);
            text.setAttribute("y", node.y + 4);
            text.setAttribute("fill", "var(--color-text-muted)");
            text.setAttribute("font-family", "Outfit");
            text.setAttribute("font-size", "9");
            text.setAttribute("font-weight", "600");
            text.setAttribute("text-anchor", "middle");
            text.textContent = node.name;

            // Hover no nó destaca todas as linhas conectadas a ele
            group.addEventListener('mouseenter', () => {
                group.setAttribute("transform", "scale(1.1) translate(-18, -18)");
                connectionExplanationText.innerHTML = `<strong>Sistema: ${node.desc}</strong>. Possui conexões dedicadas ponto a ponto com os outros ${currentSystemCount - 1} sistemas.`;
                document.getElementById('connection-explanation').className = `hover-connection-explanation ${isChaos ? 'stress-high' : ''}`;
                
                // Acende todas as conexões vinculadas
                drawnLines.forEach(line => {
                    if (line.from === idx || line.to === idx) {
                        line.element.classList.add('hovered');
                    }
                });
            });

            group.addEventListener('mouseleave', () => {
                group.setAttribute("transform", "none");
                connectionExplanationText.textContent = "Passe o mouse por cima de uma conexão ou nó do diagrama para ver a infraestrutura interna!";
                document.getElementById('connection-explanation').className = "hover-connection-explanation";
                drawnLines.forEach(line => line.element.classList.remove('hovered'));
            });

            group.appendChild(circle);
            group.appendChild(text);
            interactiveSpaghettiSvg.appendChild(group);
        });

        // 3. Atualizar métricas e alertas na barra de progresso do simulador
        const connectionsTotal = (currentSystemCount * (currentSystemCount - 1)) / 2;
        metricSystemsCount.textContent = currentSystemCount;
        metricConnectionsCount.textContent = connectionsTotal;

        // Limpa classes anteriores
        metricStressLevel.className = 'm-val';
        simulatorFeedbackAlert.className = 'metric-feedback-alert';

        if (isChaos) {
            metricStressLevel.textContent = "CATASTRÓFICO (CAOS)";
            metricStressLevel.classList.add('text-rose-light');
            alarmGlow.classList.remove('hidden');
            
            simulatorFeedbackAlert.classList.add('stress-high');
            simulatorFeedbackText.innerHTML = "<strong>CATASTRÓFE!</strong> Conexões demais. Alterar qualquer linha de código derruba os outros sistemas em efeito dominó. 100% do tempo gasto em correções.";
            
            setSimulatorIcon('alert-triangle', 'text-rose');
            btnAddSystem.disabled = true;
        } else if (isWarning) {
            metricStressLevel.textContent = "SOBRECARREGADO";
            metricStressLevel.classList.add('text-json');
            alarmGlow.classList.add('hidden');
            
            simulatorFeedbackAlert.classList.add('stress-medium');
            simulatorFeedbackText.innerHTML = "<strong>ATENÇÃO!</strong> Remendos demais acumulando. O código começa a ficar lento e manter tudo sincronizado exige muito esforço.";
            
            setSimulatorIcon('alert-circle', '#eab308');
            btnAddSystem.disabled = false;
        } else {
            metricStressLevel.textContent = "ESTÁVEL";
            metricStressLevel.classList.add('text-emerald-light');
            alarmGlow.classList.add('hidden');
            
            simulatorFeedbackText.innerHTML = "Tudo tranquilo. Apenas algumas integrações diretas. Café quente e manutenção controlada.";
            
            setSimulatorIcon('smile', 'text-emerald');
            btnAddSystem.disabled = false;
        }
    };

    // Ajusta o ícone de feedback de estresse com Lucide de forma dinâmica
    const setSimulatorIcon = (iconName, colorClassOrHex) => {
        const iconEl = simulatorFeedbackAlert.querySelector('i') || simulatorFeedbackAlert.querySelector('svg');
        if (iconEl) {
            const newIcon = document.createElement('i');
            newIcon.setAttribute('data-lucide', iconName);
            if (colorClassOrHex.startsWith('#') || colorClassOrHex.startsWith('rgb') || colorClassOrHex.startsWith('var')) {
                newIcon.style.color = colorClassOrHex;
            } else {
                newIcon.className = `err-alert-icon ${colorClassOrHex}`;
            }
            iconEl.replaceWith(newIcon);
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    };

    // Eventos de clique nos presets
    const updateActivePresetBtn = (activeBtn) => {
        [btnPreset2, btnPreset5, btnPreset10].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (activeBtn) activeBtn.classList.add('active');
    };

    if (btnPreset2) {
        btnPreset2.addEventListener('click', () => {
            currentSystemCount = 2;
            updateActivePresetBtn(btnPreset2);
            renderInteractiveSpaghetti();
        });
    }

    if (btnPreset5) {
        btnPreset5.addEventListener('click', () => {
            currentSystemCount = 5;
            updateActivePresetBtn(btnPreset5);
            renderInteractiveSpaghetti();
        });
    }

    if (btnPreset10) {
        btnPreset10.addEventListener('click', () => {
            currentSystemCount = 10;
            updateActivePresetBtn(btnPreset10);
            renderInteractiveSpaghetti();
        });
    }

    // Botão Adicionar Sistema
    if (btnAddSystem) {
        btnAddSystem.addEventListener('click', () => {
            if (currentSystemCount < 12) {
                currentSystemCount++;
                updateActivePresetBtn(null); // remove estado de preset fixo
                
                // Acende presets correspondentes se bater o valor exato
                if (currentSystemCount === 2) updateActivePresetBtn(btnPreset2);
                if (currentSystemCount === 5) updateActivePresetBtn(btnPreset5);
                if (currentSystemCount === 10) updateActivePresetBtn(btnPreset10);
                
                renderInteractiveSpaghetti();
            }
        });
    }

    // Botão Resetar Simulador
    if (btnResetSimulator) {
        btnResetSimulator.addEventListener('click', () => {
            currentSystemCount = 2;
            updateActivePresetBtn(btnPreset2);
            renderInteractiveSpaghetti();
        });
    }

    // Renderiza inicialmente com 2 sistemas
    renderInteractiveSpaghetti();


    /* ==========================================================================
       4. CONCLUSÃO DO MÓDULO E REDIRECIONAMENTO
       ========================================================================== */
    const btnNextModule = document.getElementById('btn-next-module');
    if (btnNextModule) {
        btnNextModule.addEventListener('click', () => {
            localStorage.setItem('muleacademy_completed_3', 'true');
            window.location.href = "modulo4.html";
        });
    }
});
