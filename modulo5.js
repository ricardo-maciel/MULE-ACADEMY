// ==========================================================================
// MÓDULO 5 - SIMULADOR GAMIFICADO (MISSION CONTROL) - LOGICA PRINCIPAL
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       ESTADO GLOBAL DO JOGO
       ========================================================================== */
    let currentLevel = 1;
    let maxUnlockedLevel = 1;
    let gameScore = 0;
    let timeElapsed = 0; // em segundos
    let timerInterval = null;
    let selectedL4Error = null; // 'pay' ou 'stock'
    let level2Order = ["api", null, null, null]; // API predefinido no slot 1 (idx 1), Cliente fixo no slot 0

    // Elementos de navegação e meta
    const stepBtns = document.querySelectorAll('.step-btn');
    const progressFill = document.getElementById('progress-fill');
    const metaLevelName = document.getElementById('meta-level-name');
    const metaScore = document.getElementById('meta-score');
    const missionBadge = document.getElementById('mission-badge');
    const missionTitle = document.getElementById('mission-title');
    const missionDesc = document.getElementById('mission-desc');
    const levelHelp = document.getElementById('level-instruction-help');
    
    const btnPrevLevel = document.getElementById('btn-prev-level');
    const btnNextLevel = document.getElementById('btn-next-level');
    const gameConsoleLog = document.getElementById('game-console-log');
    const btnClearConsole = document.getElementById('btn-clear-console');

    // Metadados dos Níveis do Jogo
    const levelsConfig = {
        1: { name: "Nível 1: O Fluxo", badge: "MISSÃO DO NÍVEL 1", title: "O Fluxo de Comunicação", desc: "Aprenda a mecânica básica de um fluxo de dados. Clique em 'Executar Fluxo' para assistir ao tráfego de Request/Response entre o Cliente e o Servidor." },
        2: { name: "Nível 2: A Ordem", badge: "MISSÃO DO NÍVEL 2", title: "Montando o Pipeline", desc: "Arraste os blocos de sistemas (API, Pagamento, Estoque, Entrega) e solte-os nos slots na ordem lógica em que uma compra deve ser processada." },
        3: { name: "Nível 3: Dados Reais", badge: "MISSÃO DO NÍVEL 3", title: "Execução com JSON", desc: "Execute o pedido e analise os payloads JSON que trafegam entre as etapas. Responda os mini-quizzes para desbloquear a simulação." },
        4: { name: "Nível 4: Os Erros", badge: "MISSÃO DO NÍVEL 4", title: "Simulação de Falhas", desc: "Sistemas falham no mundo real (erros HTTP 4xx/5xx). Escolha um cenário (Pagamento ou Estoque) para ver o impacto visual de um erro no pipeline." },
        5: { name: "Nível 5: O Retry", badge: "MISSÃO DO NÍVEL 5", title: "Tratamento com Retry", desc: "Se uma conexão falhar, o cliente pode executar uma política de Retry (tentar de novo). Clique no botão para corrigir a falha de timeout temporário do Pagamento." },
        6: { name: "Nível 6: O Laboratório", badge: "MISSÃO DO NÍVEL 6", title: "Modo Sandbox Livre", desc: "Você agora é o Administrador! Clique nos nós do SVG para inspecionar os payloads em tempo real e use os interruptores para testar quedas controladas." },
        7: { name: "Nível 7: O Desafio", badge: "MISSÃO DO NÍVEL 7", title: "Desafio de Engenheiro", desc: "O estoque está fora do ar e o pagamento sofrendo timeouts. Ative a política de Retry e reestabeleça o canal de estoque nos interruptores antes de disparar o fluxo final!" }
    };

    /* ==========================================================================
       SISTEMA DE LOGS DO CONSOLE (TERMINAL)
       ========================================================================== */
    const logConsole = (text, type = 'info') => {
        let color = '#38bdf8'; // azul padrão (info)
        if (type === 'success') color = 'var(--color-emerald-light)';
        if (type === 'error') color = 'var(--color-rose-light)';
        if (type === 'warning') color = '#eab308'; // amarelo
        if (type === 'json') color = 'var(--color-json)';

        const span = document.createElement('span');
        span.style.color = color;
        span.innerHTML = `\n> ${text}`;
        gameConsoleLog.appendChild(span);
        gameConsoleLog.scrollTop = gameConsoleLog.scrollHeight;
    };

    if (btnClearConsole) {
        btnClearConsole.addEventListener('click', () => {
            gameConsoleLog.textContent = '> Console de logs limpo.';
        });
    }

    /* ==========================================================================
       SVG RENDERER (DESENHO DO PIPELINE DE INTEGRAÇÃO)
       ========================================================================== */
    const gameSvgCanvas = document.getElementById('game-svg-canvas');
    const nodesConfig = [
        { id: "cli", name: "Cliente", label: "Client", x: 50, y: 100, color: "var(--color-indigo)" },
        { id: "api", name: "API", label: "Gateway", x: 150, y: 100, color: "var(--color-accent)" },
        { id: "pay", name: "Pagamento", label: "Payment", x: 250, y: 100, color: "var(--color-rose)" },
        { id: "stock", name: "Estoque", label: "Stock", x: 350, y: 100, color: "var(--color-json)" },
        { id: "delivery", name: "Entrega", label: "Shipper", x: 450, y: 100, color: "var(--color-teal)" }
    ];

    // Desenha o pipeline conforme o nível
    const drawPipeline = (nodeStatus = {}) => {
        if (!gameSvgCanvas) return;
        gameSvgCanvas.innerHTML = '';

        // Nível 1 possui apenas 3 nós (Cliente -> API -> Servidor)
        if (currentLevel === 1) {
            const l1Nodes = [
                { id: "cli", name: "Cliente", label: "Client", x: 100, y: 100, color: "var(--color-indigo)" },
                { id: "api", name: "API", label: "Gateway", x: 250, y: 100, color: "var(--color-accent)" },
                { id: "srv", name: "Servidor", label: "Server", x: 400, y: 100, color: "var(--color-teal)" }
            ];

            // Linhas
            drawSvgLine(l1Nodes[0].x, l1Nodes[0].y, l1Nodes[1].x, l1Nodes[1].y, "line-cli-api", nodeStatus.line1 || "idle");
            drawSvgLine(l1Nodes[1].x, l1Nodes[1].y, l1Nodes[2].x, l1Nodes[2].y, "line-api-srv", nodeStatus.line2 || "idle");

            // Nós
            l1Nodes.forEach(node => {
                drawSvgNode(node.x, node.y, node.name, node.label, node.color, node.id, nodeStatus[node.id] || "normal");
            });
            return;
        }

        // Nível 2 desenha os slots para ordenar
        if (currentLevel === 2) {
            // Desenha as linhas entre os slots
            for (let i = 0; i < 4; i++) {
                const x1 = 50 + i * 100;
                const x2 = 50 + (i + 1) * 100;
                drawSvgLine(x1, 100, x2, 100, `line-slot-${i}`, "idle");
            }

            // Cliente fixo no slot 0
            drawSvgNode(50, 100, "Cliente", "Client", "var(--color-indigo)", "cli", "normal");

            // Outros slots dependem do arrasto no painel
            const currentOrder = getLevel2CurrentSlots();
            for (let i = 1; i < 5; i++) {
                const type = currentOrder[i];
                const x = 50 + i * 100;
                
                if (type) {
                    const meta = nodesConfig.find(n => n.id === type);
                    drawSvgNode(x, 100, meta.name, meta.label, meta.color, meta.id, "normal");
                } else {
                    // Slot Vazio
                    drawSvgDashedSlot(x, 100, `Slot ${i + 1}`);
                }
            }
            return;
        }

        // Outros níveis desenham o pipeline completo
        // Desenha as 4 linhas
        for (let i = 0; i < 4; i++) {
            const n1 = nodesConfig[i];
            const n2 = nodesConfig[i + 1];
            let status = "idle";
            if (nodeStatus[`line${i+1}`]) status = nodeStatus[`line${i+1}`];
            drawSvgLine(n1.x, n1.y, n2.x, n2.y, `line-${n1.id}-${n2.id}`, status);
        }

        // Desenha os 5 nós
        nodesConfig.forEach(node => {
            let status = "normal";
            if (nodeStatus[node.id]) status = nodeStatus[node.id];
            drawSvgNode(node.x, node.y, node.name, node.label, node.color, node.id, status);
        });
    };

    // Auxiliares de desenho de elementos SVG
    const drawSvgLine = (x1, y1, x2, y2, id, status) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("id", id);
        
        let strokeClass = "game-line idle";
        if (status === "active") strokeClass = "game-line active";
        if (status === "error") strokeClass = "game-line error";
        line.setAttribute("class", strokeClass);

        gameSvgCanvas.appendChild(line);
    };

    const drawSvgNode = (x, y, name, label, color, id, status) => {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", `node-${id}`);
        
        let groupClass = "game-node-group";
        if (status === "active") groupClass = "game-node-group active";
        if (status === "error") {
            groupClass = "game-node-group shake-error";
            color = "var(--color-rose)";
        }
        group.setAttribute("class", groupClass);

        // Círculo principal
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "20");
        circle.setAttribute("fill", "#04060c");
        circle.setAttribute("stroke", color);
        circle.setAttribute("stroke-width", "2.5");
        if (status === "error") {
            circle.setAttribute("stroke", "var(--color-rose)");
            circle.setAttribute("fill", "rgba(244, 63, 94, 0.15)");
        }

        // Texto principal (abreviado)
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y + 4);
        text.setAttribute("fill", "#ffffff");
        text.setAttribute("font-family", "Outfit");
        text.setAttribute("font-size", "9");
        text.setAttribute("font-weight", "600");
        text.setAttribute("text-anchor", "middle");
        text.textContent = name;

        // Label secundário abaixo do nó
        const textLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textLabel.setAttribute("x", x);
        textLabel.setAttribute("y", y + 36);
        textLabel.setAttribute("fill", "var(--color-text-muted)");
        textLabel.setAttribute("font-family", "Inter");
        textLabel.setAttribute("font-size", "9");
        textLabel.setAttribute("text-anchor", "middle");
        textLabel.textContent = label;

        group.appendChild(circle);
        group.appendChild(text);
        group.appendChild(textLabel);

        // Se for o Nível 6 (Sandbox) ou Nível 7, clicar no nó mostra seus dados
        if (currentLevel === 6 || currentLevel === 7) {
            group.addEventListener('click', () => {
                showNodeSandboxData(id);
            });
        }

        gameSvgCanvas.appendChild(group);
    };

    const drawSvgDashedSlot = (x, y, textLabel) => {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "20");
        circle.setAttribute("fill", "#020305");
        circle.setAttribute("stroke", "#1e293b");
        circle.setAttribute("stroke-dasharray", "4,4");
        circle.setAttribute("stroke-width", "2");

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y + 4);
        text.setAttribute("fill", "#334155");
        text.setAttribute("font-family", "Inter");
        text.setAttribute("font-size", "9");
        text.setAttribute("text-anchor", "middle");
        text.textContent = textLabel;

        group.appendChild(circle);
        group.appendChild(text);
        gameSvgCanvas.appendChild(group);
    };

    // Spawn e Animação de Partículas
    const animateParticle = (x1, y1, x2, y2, type = 'request', callback) => {
        const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        particle.setAttribute("r", "4");
        
        let pClass = "data-particle";
        if (type === 'response') pClass = "data-particle response";
        particle.setAttribute("class", pClass);

        const animMotion = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        animMotion.setAttribute("dur", "0.6s");
        animMotion.setAttribute("fill", "freeze");
        animMotion.setAttribute("path", `M ${x1},${y1} L ${x2},${y2}`);

        particle.appendChild(animMotion);
        gameSvgCanvas.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            if (callback) callback();
        }, 600);
    };

    /* ==========================================================================
       MÁQUINA DE CONTROLE DOS NÍVEIS
       ========================================================================== */
    const updateActiveLevelView = () => {
        // Atualiza textos do topo e da missão
        const cfg = levelsConfig[currentLevel];
        metaLevelName.textContent = cfg.name;
        metaScore.textContent = gameScore;
        missionBadge.textContent = cfg.badge;
        missionTitle.textContent = cfg.title;
        missionDesc.textContent = cfg.desc;

        // Esconde todos os painéis e mostra o ativo
        document.querySelectorAll('.level-pane').forEach(p => p.classList.add('hidden'));
        const activePane = document.getElementById(`pane-level-${currentLevel}`);
        if (activePane) activePane.classList.remove('hidden');

        // Atualiza barra de progresso superior
        stepBtns.forEach((btn, idx) => {
            btn.classList.remove('active', 'completed');
            const stepLvl = idx + 1;
            if (stepLvl === currentLevel) {
                btn.classList.add('active');
            } else if (stepLvl < currentLevel || stepLvl <= maxUnlockedLevel) {
                btn.classList.add('completed');
            }
        });

        const progressPercent = ((currentLevel - 1) / 6) * 100;
        progressFill.style.width = `${progressPercent}%`;

        // Ativa/desativa botões anteriores/próximos
        btnPrevLevel.disabled = currentLevel === 1;
        btnNextLevel.disabled = currentLevel >= maxUnlockedLevel;

        if (currentLevel === maxUnlockedLevel) {
            levelHelp.textContent = "Complete o desafio para avançar.";
        } else {
            levelHelp.textContent = "Desafio concluído! Clique em Próximo para avançar de nível.";
        }

        // Para cronômetro do Nível 7 se sair dele
        if (currentLevel !== 7 && timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        // Desenha a visualização inicial do SVG para o nível carregado
        drawPipeline();
    };

    // Botões de navegação inferior
    btnPrevLevel.addEventListener('click', () => {
        if (currentLevel > 1) {
            currentLevel--;
            updateActiveLevelView();
        }
    });

    btnNextLevel.addEventListener('click', () => {
        if (currentLevel < maxUnlockedLevel) {
            currentLevel++;
            updateActiveLevelView();
        }
    });

    // Cliques diretos nos passos superiores (se desbloqueados)
    stepBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetLvl = Number(e.currentTarget.getAttribute('data-level'));
            if (targetLvl <= maxUnlockedLevel) {
                currentLevel = targetLvl;
                updateActiveLevelView();
            } else {
                logConsole(`Nível ${targetLvl} bloqueado. Conclua os desafios anteriores!`, 'warning');
            }
        });
    });

    const unlockNextLevel = () => {
        if (currentLevel === maxUnlockedLevel && maxUnlockedLevel < 7) {
            maxUnlockedLevel++;
            gameScore += 100;
            metaScore.textContent = gameScore;
        }
        btnNextLevel.disabled = false;
        levelHelp.textContent = "Desafio concluído! Avance para o próximo nível.";
        
        // Atualiza botões
        stepBtns[currentLevel - 1].classList.add('completed');
    };


    /* ==========================================================================
       NÍVEL 1: O FLUXO (LOGICA E AÇÃO)
       ========================================================================== */
    const btnRunL1 = document.getElementById('btn-run-l1');
    if (btnRunL1) {
        btnRunL1.addEventListener('click', () => {
            btnRunL1.disabled = true;
            logConsole("Iniciando fluxo de comunicação simples...", 'info');
            
            // 1. Acende primeira linha e manda partícula Cliente -> API
            drawPipeline({ line1: "active", cli: "active", api: "normal", srv: "normal" });
            logConsole("Cliente enviando Request HTTP POST...", 'info');
            
            animateParticle(100, 100, 250, 100, 'request', () => {
                // 2. Acende segunda linha e manda partícula API -> Servidor
                drawPipeline({ line1: "active", line2: "active", cli: "normal", api: "active", srv: "normal" });
                logConsole("API Gateway recebendo e validando tokens de segurança...", 'info');
                logConsole("API Gateway roteando dados brutas para o Servidor...", 'info');
                
                animateParticle(250, 100, 400, 100, 'request', () => {
                    // 3. Servidor ativo, processando
                    drawPipeline({ line1: "active", line2: "active", cli: "normal", api: "normal", srv: "active" });
                    logConsole("Servidor DB recebendo dados e inserindo na tabela...", 'info');
                    logConsole("Operação concluída. Retornando Status 201 Created...", 'success');
                    
                    // 4. Retorno: Servidor -> API
                    setTimeout(() => {
                        animateParticle(400, 100, 250, 100, 'response', () => {
                            drawPipeline({ line1: "active", line2: "active", cli: "normal", api: "active", srv: "normal" });
                            logConsole("API Gateway repassando cabeçalhos de resposta HTTP...", 'info');
                            
                            animateParticle(250, 100, 100, 100, 'response', () => {
                                drawPipeline();
                                logConsole("Cliente recebeu a resposta final!", 'success');
                                logConsole("Transação concluída com sucesso! Status HTTP 201.", 'success');
                                
                                unlockNextLevel();
                                btnRunL1.disabled = false;
                            });
                        });
                    }, 500);
                });
            });
        });
    }


    /* ==========================================================================
       NÍVEL 2: A ORDEM (DRAG AND DROP)
       ========================================================================== */
    const orderSlots = document.querySelectorAll('.order-slot');
    const dragBlocks = document.querySelectorAll('.drag-block');
    const btnValidateL2 = document.getElementById('btn-validate-l2');
    const btnResetL2 = document.getElementById('btn-reset-l2');
    const draggablesContainer = document.getElementById('draggables-container');

    const getLevel2CurrentSlots = () => {
        // Slot 0 é o Cliente (fixo)
        const order = ["cli", null, null, null, null];
        orderSlots.forEach(slot => {
            const idx = Number(slot.getAttribute('data-slot'));
            if (idx > 0) {
                const child = slot.querySelector('.drag-block');
                if (child) {
                    order[idx] = child.getAttribute('data-type');
                }
            }
        });
        return order;
    };

    // Handlers do arrastar e soltar
    dragBlocks.forEach(block => {
        block.addEventListener('dragstart', (e) => {
            block.classList.add('dragging');
            e.dataTransfer.setData('text/plain', block.id);
        });

        block.addEventListener('dragend', () => {
            block.classList.remove('dragging');
        });
    });

    orderSlots.forEach(slot => {
        const slotIdx = Number(slot.getAttribute('data-slot'));
        // Não arrasta nada para o slot 0 (Cliente fixo)
        if (slotIdx === 0) return;

        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');

            const blockId = e.dataTransfer.getData('text/plain');
            const block = document.getElementById(blockId);
            
            if (block) {
                // Se já houver um bloco dentro do slot, move o antigo de volta para a lista
                const existingBlock = slot.querySelector('.drag-block');
                if (existingBlock) {
                    draggablesContainer.appendChild(existingBlock);
                }

                // Insere novo bloco
                slot.appendChild(block);
                slot.classList.add('filled');
                
                // Limpa o texto original do slot (ex: "2. Vazio")
                const label = slot.querySelector('span');
                if (label) label.style.display = 'none';

                // Redesenha o pipeline SVG
                drawPipeline();
            }
        });
    });

    // Resetar ordem
    const resetLevel2Order = () => {
        orderSlots.forEach(slot => {
            const idx = Number(slot.getAttribute('data-slot'));
            if (idx > 0) {
                const block = slot.querySelector('.drag-block');
                if (block) {
                    draggablesContainer.appendChild(block);
                }
                slot.classList.remove('filled');
                const label = slot.querySelector('span');
                if (label) {
                    label.style.display = 'block';
                    label.textContent = `${idx + 1}. Vazio`;
                }
            }
        });
        drawPipeline();
    };

    if (btnResetL2) {
        btnResetL2.addEventListener('click', resetLevel2Order);
    }

    // Validar ordem
    if (btnValidateL2) {
        btnValidateL2.addEventListener('click', () => {
            const order = getLevel2CurrentSlots();
            
            // Verifica se preencheu tudo
            const isAnyNull = order.includes(null);
            if (isAnyNull) {
                logConsole("Erro de validação: Você deve preencher todos os 5 slots!", 'error');
                return;
            }

            // Ordem Correta:
            // 0: cli, 1: api, 2: pay, 3: stock, 4: delivery
            const isCorrect = order[0] === 'cli' && order[1] === 'api' && order[2] === 'pay' && order[3] === 'stock' && order[4] === 'delivery';

            if (isCorrect) {
                logConsole("Ordem do Pipeline Validada com Sucesso!", 'success');
                logConsole("1. Cliente dispara -> 2. API recebe -> 3. Pagamento cobra -> 4. Estoque separa -> 5. Entrega calcula frete.", 'success');
                unlockNextLevel();
            } else {
                logConsole("Validação Falhou! Verifique a lógica de negócios da empresa.", 'error');
                
                // Dá dicas didáticas baseado nos erros
                if (order[1] !== 'api') {
                    logConsole("Dica: Todo tráfego externo deve bater primeiro na porta de entrada da empresa (API Gateway)!", 'warning');
                } else if (order[2] !== 'pay') {
                    logConsole("Dica: Você deve cobrar o cliente (Pagamento) antes de separar as caixas (Estoque)!", 'warning');
                } else if (order[3] !== 'stock') {
                    logConsole("Dica: Verifique o Estoque antes de acionar a transportadora para a Entrega!", 'warning');
                } else {
                    logConsole("Dica: A Entrega deve ser o último passo após os dados estarem faturados e empacotados.", 'warning');
                }
            }
        });
    }

    // Ações para cliques rápidos em fallback (Level 2)
    // Se o usuário clicar em um bloco arrastável no Nível 2
    document.querySelectorAll('.drag-block').forEach(block => {
        block.addEventListener('click', () => {
            if (currentLevel !== 2) return;
            
            // Se o bloco já estiver em um slot, move de volta para a lista (pool)
            if (block.parentNode.classList.contains('order-slot')) {
                const parentSlot = block.parentNode;
                draggablesContainer.appendChild(block);
                parentSlot.classList.remove('filled');
                
                const idx = Number(parentSlot.getAttribute('data-slot'));
                const label = parentSlot.querySelector('span');
                if (label) {
                    label.style.display = 'block';
                    label.textContent = `${idx + 1}. Vazio`;
                }
                drawPipeline();
                return;
            }

            // Se o bloco está na lista, move para o primeiro slot vazio
            let targetSlot = null;
            for (let i = 1; i < 5; i++) {
                const slot = document.querySelector(`.order-slot[data-slot="${i}"]`);
                if (slot && !slot.querySelector('.drag-block')) {
                    targetSlot = slot;
                    break;
                }
            }

            if (targetSlot) {
                targetSlot.appendChild(block);
                targetSlot.classList.add('filled');
                const label = targetSlot.querySelector('span');
                if (label) label.style.display = 'none';
                drawPipeline();
            }
        });
    });


    /* ==========================================================================
       NÍVEL 3: DADOS REAIS & QUIZZES
       ========================================================================== */
    const btnRunL3 = document.getElementById('btn-run-l3');
    const l3QuizCard = document.getElementById('l3-quiz-card');
    const l3QuizQuestion = document.getElementById('l3-quiz-question');
    const l3QuizOptions = document.getElementById('l3-quiz-options');
    const l3Info = document.getElementById('l3-info');

    let l3QuizStep = 0;

    const runLevel3Simulation = () => {
        btnRunL3.disabled = true;
        l3Info.classList.add('hidden');
        l3QuizCard.classList.add('hidden');

        logConsole("Disparando novo pedido da loja...", 'info');
        drawPipeline({ line1: "active", cli: "active" });

        // Passo 1: Cliente envia payload
        animateParticle(50, 100, 150, 100, 'request', () => {
            drawPipeline({ line1: "active", cli: "normal", api: "active" });
            
            const payload = {
                "pedidoId": 987,
                "cliente": "Maria Silva",
                "total": 299.90
            };
            logConsole("Payload enviado pelo Cliente (Request Body):\n" + JSON.stringify(payload, null, 2), 'json');

            // Pausa para o Quiz 1
            setTimeout(() => {
                showL3Quiz(1);
            }, 1000);
        });
    };

    const showL3Quiz = (quizNumber) => {
        l3QuizCard.classList.remove('hidden');
        l3QuizOptions.innerHTML = '';

        if (quizNumber === 1) {
            l3QuizQuestion.textContent = "Pergunta 1: O que esse bloco JSON enviado pelo Cliente representa?";
            
            addQuizOption("A) É a resposta final do servidor dizendo que a compra chegou na casa do cliente.", false, 1);
            addQuizOption("B) É a requisição (Request) contendo os dados brutos da compra para processamento.", true, 1);
        } else {
            l3QuizQuestion.textContent = "Pergunta 2: Qual etapa deve ocorrer obrigatoriamente logo após o Estoque confirmar o produto?";
            
            addQuizOption("A) Entrega (calcular rotas de frete e despachar a caixa).", true, 2);
            addQuizOption("B) Repetir o pagamento novamente no cartão.", false, 2);
        }
    };

    const addQuizOption = (text, isCorrect, quizNum) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = text;
        btn.addEventListener('click', () => {
            // Desabilita opções
            l3QuizOptions.querySelectorAll('button').forEach(b => b.disabled = true);
            
            if (isCorrect) {
                btn.classList.add('success-ans');
                logConsole("Resposta Correta! +50 Pontos.", 'success');
                gameScore += 50;
                metaScore.textContent = gameScore;

                setTimeout(() => {
                    l3QuizCard.classList.add('hidden');
                    resumeLevel3Simulation(quizNum);
                }, 1500);
            } else {
                btn.classList.add('fail-ans');
                logConsole("Resposta Incorreta! Tente analisar o cabeçalho dos fluxos.", 'error');
                setTimeout(() => {
                    // Libera botões para tentar de novo
                    l3QuizOptions.querySelectorAll('button').forEach(b => b.disabled = false);
                }, 1500);
            }
        });
        l3QuizOptions.appendChild(btn);
    };

    const resumeLevel3Simulation = (quizNum) => {
        if (quizNum === 1) {
            logConsole("Processando pagamento no cartão...", 'info');
            drawPipeline({ line1: "active", line2: "active", api: "normal", pay: "active" });

            animateParticle(150, 100, 250, 100, 'request', () => {
                logConsole("Gateway de Pagamento autorizou a transação! Status: 200 OK.", 'success');
                
                logConsole("Checando estoque físico para separação...", 'info');
                drawPipeline({ line1: "active", line2: "active", line3: "active", pay: "normal", stock: "active" });

                animateParticle(250, 100, 350, 100, 'request', () => {
                    logConsole("Estoque: Produto Fiat Uno miniatura reservado!", 'success');
                    
                    // Pausa para Quiz 2
                    setTimeout(() => {
                        showL3Quiz(2);
                    }, 1000);
                });
            });
        } else {
            // Quiz 2 resolvido
            logConsole("Despachando para logística de Entrega...", 'info');
            drawPipeline({ line1: "active", line2: "active", line3: "active", line4: "active", stock: "normal", delivery: "active" });

            animateParticle(350, 100, 450, 100, 'request', () => {
                logConsole("Entrega: Código de rastreamento gerado (BR77983X).", 'success');
                
                // Retorno da Resposta ao Cliente
                logConsole("Retornando Response final do pedido completo...", 'info');
                
                setTimeout(() => {
                    animateParticle(450, 100, 350, 100, 'response', () => {
                        animateParticle(350, 100, 250, 100, 'response', () => {
                            animateParticle(250, 100, 150, 100, 'response', () => {
                                animateParticle(150, 100, 50, 100, 'response', () => {
                                    drawPipeline();
                                    logConsole("Pedido finalizado com sucesso! Response payload recebido pelo Cliente.", 'success');
                                    
                                    unlockNextLevel();
                                    btnRunL3.disabled = false;
                                    l3Info.classList.remove('hidden');
                                    l3Info.className = 'alert-info-box alert-success';
                                    l3Info.querySelector('span').textContent = "Fluxo com JSON completo! Nível 4 liberado.";
                                });
                            });
                        });
                    });
                }, 500);
            });
        }
    };

    if (btnRunL3) {
        btnRunL3.addEventListener('click', runLevel3Simulation);
    }


    /* ==========================================================================
       NÍVEL 4: ERROS (SIMULAR FALHAS NO PIPELINE)
       ========================================================================== */
    const btnL4ErrPay = document.getElementById('btn-l4-err-pay');
    const btnL4ErrStock = document.getElementById('btn-l4-err-stock');

    const runLevel4Simulation = (errType) => {
        selectedL4Error = errType;
        btnL4ErrPay.disabled = true;
        btnL4ErrStock.disabled = true;
        
        logConsole(`Simulando erro de integração na etapa: ${errType === 'pay' ? 'Pagamento' : 'Estoque'}...`, 'warning');
        drawPipeline({ line1: "active", cli: "active" });

        animateParticle(50, 100, 150, 100, 'request', () => {
            drawPipeline({ line1: "active", line2: "active", cli: "normal", api: "active" });

            animateParticle(150, 100, 250, 100, 'request', () => {
                if (errType === 'pay') {
                    // Falha no Pagamento
                    drawPipeline({ line1: "active", line2: "error", api: "normal", pay: "error" });
                    logConsole("Tentativa de débito enviada ao Gateway de Cartões...", 'info');
                    
                    setTimeout(() => {
                        logConsole("Erro HTTP 402 Payment Required: Cartão de Crédito Recusado (Saldo Insuficiente).", 'error');
                        document.getElementById('game-panic-overlay').classList.remove('hidden');
                        
                        setTimeout(() => {
                            document.getElementById('game-panic-overlay').classList.add('hidden');
                            unlockNextLevel();
                            btnL4ErrPay.disabled = false;
                            btnL4ErrStock.disabled = false;
                        }, 1500);
                    }, 500);
                } else {
                    // Sucesso no pagamento, falha no estoque
                    drawPipeline({ line1: "active", line2: "active", api: "normal", pay: "active" });
                    logConsole("Gateway de Pagamento autorizou transação com sucesso.", 'success');
                    
                    setTimeout(() => {
                        drawPipeline({ line1: "active", line2: "active", line3: "error", pay: "normal", stock: "error" });
                        logConsole("Consultando Estoque do produto Fiat Uno...", 'info');
                        
                        animateParticle(250, 100, 350, 100, 'request', () => {
                            logConsole("Erro HTTP 404 Not Found: Estoque indisponível para o produto selecionado.", 'error');
                            document.getElementById('game-panic-overlay').classList.remove('hidden');
                            
                            setTimeout(() => {
                                document.getElementById('game-panic-overlay').classList.add('hidden');
                                unlockNextLevel();
                                btnL4ErrPay.disabled = false;
                                btnL4ErrStock.disabled = false;
                            }, 1500);
                        });
                    }, 500);
                }
            });
        });
    };

    if (btnL4ErrPay) {
        btnL4ErrPay.addEventListener('click', () => runLevel4Simulation('pay'));
    }
    if (btnL4ErrStock) {
        btnL4ErrStock.addEventListener('click', () => runLevel4Simulation('stock'));
    }


    /* ==========================================================================
       NÍVEL 5: RETRY MECHANICS
       ========================================================================== */
    const btnRunL5 = document.getElementById('btn-run-l5');
    if (btnRunL5) {
        btnRunL5.addEventListener('click', () => {
            btnRunL5.disabled = true;
            logConsole("Disparando reenvio com Política de Retry ativa (Tentativas máximas: 3)...", 'warning');
            
            drawPipeline({ line1: "active", cli: "active" });

            animateParticle(50, 100, 150, 100, 'request', () => {
                drawPipeline({ line1: "active", line2: "active", cli: "normal", api: "active" });

                animateParticle(150, 100, 250, 100, 'request', () => {
                    // Simula erro na primeira tentativa
                    drawPipeline({ line1: "active", line2: "error", api: "normal", pay: "error" });
                    logConsole("Tentativa 1: Timeout de conexão no Gateway de Pagamento.", 'error');
                    
                    setTimeout(() => {
                        logConsole("Política de Retry: Aguardando 1s para tentar novamente...", 'warning');
                        
                        setTimeout(() => {
                            logConsole("Tentativa 2: Reenviando payload ao Gateway...", 'warning');
                            drawPipeline({ line1: "active", line2: "active", api: "normal", pay: "active" });

                            animateParticle(150, 100, 250, 100, 'request', () => {
                                logConsole("Tentativa 2: Conexão estabelecida! Cartão autorizado com sucesso.", 'success');
                                
                                // Segue o fluxo restante normalmente
                                drawPipeline({ line1: "active", line2: "active", line3: "active", pay: "normal", stock: "active" });
                                
                                animateParticle(250, 100, 350, 100, 'request', () => {
                                    drawPipeline({ line1: "active", line2: "active", line3: "active", line4: "active", stock: "normal", delivery: "active" });
                                    
                                    animateParticle(350, 100, 450, 100, 'request', () => {
                                        drawPipeline();
                                        logConsole("Pedido integrado até o final após o Retry bem-sucedido!", 'success');
                                        
                                        unlockNextLevel();
                                        btnRunL5.disabled = false;
                                    });
                                });
                            });
                        }, 1000);
                    }, 1000);
                });
            });
        });
    }


    /* ==========================================================================
       NÍVEL 6: MODO LABORATÓRIO (SANDBOX FREE PLAY)
       ========================================================================== */
    const switchErrPay = document.getElementById('switch-err-pay');
    const switchErrStock = document.getElementById('switch-err-stock');
    const switchErrDelivery = document.getElementById('switch-err-delivery');
    const btnRunL6 = document.getElementById('btn-run-l6');

    // Mapeamento dos cliques nos nós no Sandbox
    const nodePayloads = {
        cli: { request: { "clienteId": 12, "IP": "200.18.90.1", "navegador": "Chrome" }, response: { "status": "sessao_ativa" } },
        api: { request: { "route": "/v1/orders", "apikey": "ak_test_897hS" }, response: { "gateway": "routes_resolved" } },
        pay: { request: { "cartaoToken": "tok_9918a", "valor": 299.90 }, response: { "transacaoId": "ch_778A", "status": "capturada" } },
        stock: { request: { "verificarSku": "mini_fiat_uno_2010" }, response: { "estoqueSku": 15, "locacao": "Aisle_B" } },
        delivery: { request: { "cepDestino": "65000-000", "pesoKg": 0.4 }, response: { "rastreamento": "BR88718A", "prazoDias": 4 } }
    };

    const showNodeSandboxData = (nodeId) => {
        const data = nodePayloads[nodeId];
        if (data) {
            logConsole(`Dados inspecionados do Nó: ${nodeId.toUpperCase()}`, 'warning');
            logConsole("Entrada de Dados (Request Payload):\n" + JSON.stringify(data.request, null, 2), 'json');
            logConsole("Saída de Dados (Response Payload):\n" + JSON.stringify(data.response, null, 2), 'success');
        }
    };

    const runSandboxSimulation = () => {
        btnRunL6.disabled = true;
        
        const errPay = switchErrPay.checked;
        const errStock = switchErrStock.checked;
        const errDelivery = switchErrDelivery.checked;

        logConsole("Iniciando fluxo sandbox personalizado...", 'warning');
        drawPipeline({ line1: "active", cli: "active" });

        // API
        animateParticle(50, 100, 150, 100, 'request', () => {
            drawPipeline({ line1: "active", line2: "active", cli: "normal", api: "active" });

            // Pagamento
            animateParticle(150, 100, 250, 100, 'request', () => {
                if (errPay) {
                    drawPipeline({ line1: "active", line2: "error", api: "normal", pay: "error" });
                    logConsole("Simulação Sandbox: Fluxo interrompido no Pagamento (Erro ativo).", 'error');
                    btnRunL6.disabled = false;
                    return;
                }

                drawPipeline({ line1: "active", line2: "active", api: "normal", pay: "active" });

                // Estoque
                animateParticle(250, 100, 350, 100, 'request', () => {
                    if (errStock) {
                        drawPipeline({ line1: "active", line2: "active", line3: "error", pay: "normal", stock: "error" });
                        logConsole("Simulação Sandbox: Fluxo interrompido no Estoque (Erro ativo).", 'error');
                        btnRunL6.disabled = false;
                        return;
                    }

                    drawPipeline({ line1: "active", line2: "active", line3: "active", pay: "normal", stock: "active" });

                    // Entrega
                    animateParticle(350, 100, 450, 100, 'request', () => {
                        if (errDelivery) {
                            drawPipeline({ line1: "active", line2: "active", line3: "active", line4: "error", stock: "normal", delivery: "error" });
                            logConsole("Simulação Sandbox: Fluxo interrompido na Entrega (Erro ativo).", 'error');
                            btnRunL6.disabled = false;
                            return;
                        }

                        // Sucesso
                        drawPipeline({ line1: "active", line2: "active", line3: "active", line4: "active", stock: "normal", delivery: "active" });
                        logConsole("Simulação Sandbox: Fluxo completo executado com sucesso!", 'success');
                        
                        unlockNextLevel();
                        btnRunL6.disabled = false;
                    });
                });
            });
        });
    };

    if (btnRunL6) {
        btnRunL6.addEventListener('click', runSandboxSimulation);
    }


    /* ==========================================================================
       NÍVEL 7: DESAFIO FINAL (TIMER & RESOLUÇÃO CONTRA O RELÓGIO)
       ========================================================================== */
    const switchL7Stock = document.getElementById('switch-l7-stock');
    const switchL7Retry = document.getElementById('switch-l7-retry');
    const btnRunL7 = document.getElementById('btn-run-l7');
    const timerDisplay = document.getElementById('l7-timer');

    const startL7Timer = () => {
        timeElapsed = 0;
        timerDisplay.textContent = "00:00";
        if (timerInterval) clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            timeElapsed++;
            const mins = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
            const secs = (timeElapsed % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    };

    // Aciona temporizador quando o usuário entra no Nível 7
    const checkLevel7Start = () => {
        if (currentLevel === 7) {
            logConsole("DESAFIO FINAL INICIADO!", 'warning');
            logConsole("Identifique as chaves e os parâmetros do terminal para consertar a integração o mais rápido possível!", 'warning');
            startL7Timer();
        }
    };

    // Hook no botão do próximo passo para iniciar temporizador se entrar no 7
    btnNextLevel.addEventListener('click', checkLevel7Start);
    stepBtns.forEach(btn => btn.addEventListener('click', checkLevel7Start));

    if (btnRunL7) {
        btnRunL7.addEventListener('click', () => {
            btnRunL7.disabled = true;

            const isStockFixed = switchL7Stock.checked;
            const isRetryActive = switchL7Retry.checked;

            logConsole("Disparando fluxo final de validação...", 'info');
            drawPipeline({ line1: "active", cli: "active" });

            animateParticle(50, 100, 150, 100, 'request', () => {
                drawPipeline({ line1: "active", line2: "active", cli: "normal", api: "active" });

                // Etapa de Pagamento (Timeout temporário)
                animateParticle(150, 100, 250, 100, 'request', () => {
                    if (!isRetryActive) {
                        drawPipeline({ line1: "active", line2: "error", api: "normal", pay: "error" });
                        logConsole("Erro de Timeout no Gateway de Pagamento! A transação congelou e a compra caiu (Sem política de Retry cadastrada).", 'error');
                        btnRunL7.disabled = false;
                        return;
                    }

                    // Retry habilitado resolve o erro
                    drawPipeline({ line1: "active", line2: "error", api: "normal", pay: "error" });
                    logConsole("Timeout no Pagamento... Executando tentativa 2 com Retry...", 'warning');
                    
                    setTimeout(() => {
                        drawPipeline({ line1: "active", line2: "active", api: "normal", pay: "active" });
                        logConsole("Tentativa 2: Pagamento faturado com sucesso!", 'success');

                        // Etapa de Estoque
                        animateParticle(250, 100, 350, 100, 'request', () => {
                            if (!isStockFixed) {
                                drawPipeline({ line1: "active", line2: "active", line3: "error", pay: "normal", stock: "error" });
                                logConsole("Erro HTTP 503 Service Unavailable: Estoque offline! Canal desconectado.", 'error');
                                btnRunL7.disabled = false;
                                return;
                            }

                            drawPipeline({ line1: "active", line2: "active", line3: "active", pay: "normal", stock: "active" });
                            logConsole("Estoque: Consulta concluída e produto Fiat Uno separado no armazém.", 'success');

                            // Etapa de Entrega
                            animateParticle(350, 100, 450, 100, 'request', () => {
                                drawPipeline({ line1: "active", line2: "active", line3: "active", line4: "active", stock: "normal", delivery: "active" });
                                
                                animateParticle(450, 100, 350, 100, 'response', () => {
                                    drawPipeline();
                                    logConsole("Integração concluída com 100% de sucesso sob instabilidade!", 'success');
                                    
                                    // Desafio Concluído!
                                    if (timerInterval) clearInterval(timerInterval);
                                    
                                    // Calcula pontuação baseado no tempo
                                    const timeBonus = Math.max(0, 500 - timeElapsed * 3);
                                    gameScore += timeBonus + 200;
                                    metaScore.textContent = gameScore;

                                    setTimeout(() => {
                                        showGraduationScreen();
                                    }, 1500);
                                });
                            });
                        });
                    }, 1200);
                });
            });
        });
    }

    /* ==========================================================================
       GRADUAÇÃO E CONCLUSÃO FINAL DO CURSO
       ========================================================================== */
    const graduationScreen = document.getElementById('graduation-screen');
    const mainGameLayout = document.getElementById('main-game-layout');
    const finalScoreVal = document.getElementById('final-score-val');
    const finalTimeVal = document.getElementById('final-time-val');
    const btnGraduateCourse = document.getElementById('btn-graduate-course');

    const showGraduationScreen = () => {
        // Oculta painel de jogo e mostra o painel de graduação
        mainGameLayout.classList.add('hidden');
        graduationScreen.classList.remove('hidden');

        // Mostra indicadores finais
        finalScoreVal.textContent = gameScore;
        
        const mins = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
        const secs = (timeElapsed % 60).toString().padStart(2, '0');
        finalTimeVal.textContent = `${mins}:${secs}`;
        
        localStorage.setItem('muleacademy_completed_5', 'true');
    };

    if (btnGraduateCourse) {
        btnGraduateCourse.addEventListener('click', () => {
            localStorage.setItem('muleacademy_completed_5', 'true');
            window.location.href = "dashboard.html";
        });
    }

    // Inicializa a visualização da página
    updateActiveLevelView();
});
