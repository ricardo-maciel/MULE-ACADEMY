// ==========================================================================
// AULA DE APIS E INTEGRAÇÃO - JAVASCRIPT PRINCIPAL
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
    const sectionIds = ['hero', 'cap1', 'cap2', 'cap3', 'cap4', 'cap5', 'cap6', 'conclusion'];

    // Rolar de forma suave para a seção desejada
    const scrollToSection = (targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Cliques nos círculos numerados do progresso superior
    stepBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            scrollToSection(targetId);
        });
    });

    // Cliques nos botões de "Avançar" no rodapé de cada capítulo
    document.querySelectorAll('.next-section-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-next');
            scrollToSection(targetId);
        });
    });

    // Botão de início na seção Hero
    const startClassBtn = document.getElementById('btn-start-class');
    if (startClassBtn) {
        startClassBtn.addEventListener('click', () => {
            scrollToSection('cap1');
        });
    }

    // Botão de reiniciar aula na Conclusão
    const restartBtn = document.getElementById('btn-restart-class');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            scrollToSection('hero');
            resetSimulator();
        });
    }

    // Atualiza os estilos de progresso superior
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

        // Atualiza a barra de linha que conecta os passos
        const progressPercent = (activeIndex / (sectionIds.length - 1)) * 100;
        progressFill.style.width = `${progressPercent}%`;
    };

    // Intersection Observer para rastrear a rolagem e atualizar a navegação superior
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // Ativa quando a seção cruza o centro da tela
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveStep(entry.target.id);
                // Marca o módulo 1 como concluído no localStorage
                if (entry.target.id === 'conclusion') {
                    localStorage.setItem('muleacademy_completed_1', 'true');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));


    /* ==========================================================================
       2. INTERATIVIDADE DO CAPÍTULO 2 (CONEXÃO ESPAGUETE MANUAL)
       ========================================================================== */
    const btnToggleSpaghetti = document.getElementById('btn-toggle-spaghetti');
    const spaghettiLines = document.getElementById('spaghetti-lines');
    const spaghettiWarning = document.getElementById('spaghetti-warning-text');

    if (btnToggleSpaghetti) {
        btnToggleSpaghetti.addEventListener('click', () => {
            const isActive = spaghettiLines.classList.contains('active');
            
            if (isActive) {
                spaghettiLines.classList.remove('active');
                spaghettiWarning.classList.add('hidden');
                btnToggleSpaghetti.textContent = 'Ver Conexão Manual';
                btnToggleSpaghetti.classList.replace('btn-outline', 'btn-accent');
            } else {
                spaghettiLines.classList.add('active');
                spaghettiWarning.classList.remove('hidden');
                btnToggleSpaghetti.textContent = 'Ocultar Conexão Manual';
                btnToggleSpaghetti.classList.replace('btn-accent', 'btn-outline');
            }
        });
    }


    /* ==========================================================================
       3. SIMULADOR DE API INTERATIVO (CAPÍTULO 4)
       ========================================================================== */
    const btnRunRequest = document.getElementById('btn-run-request');
    const btnSimulateError = document.getElementById('btn-simulate-error');
    const btnRetry = document.getElementById('btn-retry');
    
    const nodeClient = document.getElementById('node-client').querySelector('.node-circle');
    const nodeApi = document.getElementById('node-api').querySelector('.node-circle');
    const nodeServer = document.getElementById('node-server').querySelector('.node-circle');
    
    const packetData = document.getElementById('packet-data');
    const packetData2 = document.getElementById('packet-data-2');
    
    const bridgeLine1 = document.querySelector('.bridge-line');
    const bridgeLine2 = document.querySelector('.bridge-line-2');
    
    const simStatusBox = document.getElementById('sim-status');
    const simStatusText = document.getElementById('sim-status-text');
    
    const jsonReqCode = document.getElementById('json-request');
    const jsonResCode = document.getElementById('json-response');
    const httpStatusBadge = document.getElementById('http-status-badge');

    // Payloads padrão para exibição
    const requestPayload = {
        "pedido_id": 123,
        "item": "Tênis Lunar",
        "quantidade": 1
    };

    const successResponse = {
        "status": "aprovado",
        "transacao_id": "tx_87541296",
        "rastreio": "BR-98765-XP",
        "mensagem": "Pedido faturado com sucesso!"
    };

    const errorResponse = {
        "erro": "Ops! Algo deu errado",
        "status": 500,
        "detalhe": "Erro Interno no Servidor ao conectar ao Banco de Dados."
    };

    let isRequestRunning = false;

    // Efeito de digitação no monitor JSON
    const typeJSON = (element, dataObj, callback) => {
        const jsonStr = JSON.stringify(dataObj, null, 2);
        element.textContent = '';
        let index = 0;
        
        // Define a velocidade da digitação rápida
        const timer = setInterval(() => {
            if (index < jsonStr.length) {
                element.textContent += jsonStr.charAt(index);
                index++;
            } else {
                clearInterval(timer);
                if (callback) callback();
            }
        }, 12);
    };

    // Altera a classe e mensagem da caixa de status
    const updateSimStatus = (text, type = 'info') => {
        simStatusText.textContent = text;
        simStatusBox.className = 'simulation-status';
        
        const icon = simStatusBox.querySelector('.status-icon');
        
        if (type === 'success') {
            simStatusBox.classList.add('success-status');
            icon.setAttribute('data-lucide', 'check-circle');
        } else if (type === 'error') {
            simStatusBox.classList.add('error-status');
            icon.setAttribute('data-lucide', 'x-circle');
        } else {
            icon.setAttribute('data-lucide', 'info');
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Remove classes ativas de visualização para preparar o fluxo
    const clearVisualStates = () => {
        nodeClient.classList.remove('active-node');
        nodeApi.classList.remove('active-node');
        nodeServer.classList.remove('active-node');
        
        bridgeLine1.classList.remove('active-line');
        bridgeLine2.classList.remove('active-line');
        
        packetData.className = 'data-packet';
        packetData2.className = 'data-packet';
        
        httpStatusBadge.className = 'terminal-http-badge idly';
        httpStatusBadge.textContent = '---';
    };

    // Reseta completamente o estado do simulador
    const resetSimulator = () => {
        clearVisualStates();
        jsonReqCode.textContent = '{\n  "pedido_id": null\n}';
        jsonResCode.textContent = '{\n  "mensagem": "Aguardando requisição..."\n}';
        updateSimStatus('Pronto para iniciar. Escolha uma ação abaixo!', 'info');
        
        btnRunRequest.disabled = false;
        btnSimulateError.disabled = false;
        btnRetry.classList.add('hidden');
        isRequestRunning = false;
    };

    // Executa a requisição simulada de ponta a ponta (Passo a Passo)
    const runSimulationFlow = (isErrorMode) => {
        if (isRequestRunning) return;
        isRequestRunning = true;
        
        // Desativa botões durante animação
        btnRunRequest.disabled = true;
        btnSimulateError.disabled = true;
        btnRetry.disabled = true;
        
        clearVisualStates();

        // --- PASSO 1: Cliente dispara requisição ---
        nodeClient.classList.add('active-node');
        updateSimStatus('Cliente preparando e enviando o JSON de requisição...');
        
        typeJSON(jsonReqCode, requestPayload, () => {
            // Inicia tráfego do pacote do Cliente para a API
            bridgeLine1.classList.add('active-line');
            packetData.classList.add('packet-to-api');
            updateSimStatus('Request viajando pela internet até o Garçom (API)...');

            setTimeout(() => {
                // --- PASSO 2: API recebe e envia para o Servidor ---
                nodeClient.classList.remove('active-node');
                nodeApi.classList.add('active-node');
                packetData.classList.remove('packet-to-api');
                packetData.style.opacity = '0';
                updateSimStatus('A API recebeu os dados e está verificando com o Servidor...');

                setTimeout(() => {
                    bridgeLine2.classList.add('active-line');
                    packetData2.classList.add('packet-to-server');
                    updateSimStatus('A API encaminha o pedido para processamento do Servidor (Cozinha)...');

                    setTimeout(() => {
                        // --- PASSO 3: Servidor processa a lógica ---
                        nodeApi.classList.remove('active-node');
                        nodeServer.classList.add('active-node');
                        packetData2.classList.remove('packet-to-server');
                        packetData2.style.opacity = '0';
                        updateSimStatus('Servidor processando no Banco de Dados...');

                        setTimeout(() => {
                            // --- PASSO 4: Servidor retorna resposta para a API ---
                            updateSimStatus('Processamento concluído. Servidor enviando resposta para a API...');
                            packetData2.classList.add('packet-from-server');

                            setTimeout(() => {
                                // --- PASSO 5: API recebe e envia resposta final ---
                                nodeServer.classList.remove('active-node');
                                nodeApi.classList.add('active-node');
                                packetData2.classList.remove('packet-from-server');
                                packetData2.style.opacity = '0';
                                updateSimStatus('API formatando o pacote final para o Cliente...');

                                setTimeout(() => {
                                    packetData.classList.add('packet-from-api');
                                    updateSimStatus('Response sendo entregue de volta ao Cliente (Browser)...');

                                    setTimeout(() => {
                                        // --- PASSO 6: Cliente recebe resposta final ---
                                        nodeApi.classList.remove('active-node');
                                        nodeClient.classList.add('active-node');
                                        packetData.classList.remove('packet-from-api');
                                        packetData.style.opacity = '0';

                                        // Define o resultado baseado no modo de simulação (Erro ou Sucesso)
                                        if (isErrorMode) {
                                            typeJSON(jsonResCode, errorResponse, () => {
                                                httpStatusBadge.textContent = '500 ERROR';
                                                httpStatusBadge.className = 'terminal-http-badge error-500';
                                                updateSimStatus('Erro! O Servidor caiu (Código 500). Mas espere... nós podemos tentar novamente!', 'error');
                                                
                                                // Exibe botão Retry e mantém os outros desativados
                                                btnRetry.classList.remove('hidden');
                                                btnRetry.disabled = false;
                                                isRequestRunning = false;
                                            });
                                        } else {
                                            typeJSON(jsonResCode, successResponse, () => {
                                                httpStatusBadge.textContent = '200 OK';
                                                httpStatusBadge.className = 'terminal-http-badge success-200';
                                                updateSimStatus('Sucesso! O pedido foi aprovado e o código de rastreio gerado (HTTP 200).', 'success');
                                                
                                                // Libera botões e oculta Retry caso tenha sucesso
                                                btnRunRequest.disabled = false;
                                                btnSimulateError.disabled = false;
                                                btnRetry.classList.add('hidden');
                                                isRequestRunning = false;
                                            });
                                        }

                                    }, 800); // Fim animação API -> Cliente
                                }, 800); // Preparação API -> Cliente
                            }, 800); // Fim animação Servidor -> API
                        }, 1000); // Tempo processamento Servidor
                    }, 800); // Fim animação API -> Servidor
                }, 800); // Preparação API -> Servidor
            }, 800); // Fim animação Cliente -> API
        });
    };

    // Ações dos botões
    if (btnRunRequest) {
        btnRunRequest.addEventListener('click', () => {
            runSimulationFlow(false); // Sucesso
        });
    }

    if (btnSimulateError) {
        btnSimulateError.addEventListener('click', () => {
            runSimulationFlow(true); // Erro
        });
    }

    if (btnRetry) {
        btnRetry.addEventListener('click', () => {
            // Executa a lógica de Retry
            updateSimStatus('Retry disparado! O cliente detectou a falha 500 e reenviou a requisição automaticamente.');
            btnRetry.classList.add('hidden');
            
            // Re-executa como sucesso simulando que a segunda tentativa deu certo
            runSimulationFlow(false);
        });
    }

    // Listener para o botão de finalização salvar progresso
    const btnFinalLearn = document.getElementById('btn-final-learn');
    if (btnFinalLearn) {
        btnFinalLearn.addEventListener('click', () => {
            localStorage.setItem('muleacademy_completed_1', 'true');
        });
    }

    // Inicializa o simulador em idle
    resetSimulator();
});
