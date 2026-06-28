document.addEventListener('DOMContentLoaded', () => {
    // Inicializa ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // PROGRESSÃO DE ETAPAS (NAVEGAÇÃO POR SEÇÕES E CLIQUES)
    // ==========================================================================
    const sections = document.querySelectorAll('.chapter-section');
    const stepButtons = document.querySelectorAll('.step-btn');
    const progressFill = document.getElementById('progress-fill');

    // Função para atualizar o cabeçalho de progresso com base na seção ativa
    const updateProgressHeader = (activeId) => {
        let activeIndex = 0;
        sections.forEach((section, index) => {
            if (section.id === activeId) {
                activeIndex = index;
            }
        });

        // Grava progresso intermediário conforme o estágio alcançado:
        // Se alcançou o estágio 3 (Formatos Corporativos / Aula 2), concluiu Aula 1
        if (activeIndex >= 2) {
            localStorage.setItem('muleacademy_completed_dados_1', 'true');
        }
        // Se alcançou o estágio 4 (Simulador de Tradução / Aula 3), concluiu Aula 2
        if (activeIndex >= 3) {
            localStorage.setItem('muleacademy_completed_dados_2', 'true');
        }

        // Atualizar classes dos botões
        stepButtons.forEach((btn, index) => {
            if (index <= activeIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Atualizar barra de progresso preenchida (0% a 100%)
        const progressPercent = (activeIndex / (sections.length - 1)) * 100;
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
    };

    // Suporte para scroll suave para a seção correta
    const scrollToSection = (targetId) => {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Força a classe active nas seções para triggers CSS se necessário
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.classList.add('active-section');
                } else {
                    sec.classList.remove('active-section');
                }
            });
            updateProgressHeader(targetId);
        }
    };

    // Clique nas etapas de navegação superiores
    stepButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            scrollToSection(targetId);
        });
    });

    // Clique nos botões "Avançar" internos de cada seção
    document.querySelectorAll('.next-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextId = btn.getAttribute('data-next');
            scrollToSection(nextId);
        });
    });

    // Observer para atualizar barra de progresso no scroll natural
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateProgressHeader(id);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // ==========================================================================
    // ETAPA 2: ANIMADOR DE TRADUÇÃO DE PACOTES
    // ==========================================================================
    const btnTranslateAB = document.getElementById('btn-translate-a-b');
    const btnTranslateCA = document.getElementById('btn-translate-c-a');
    const dataPulse = document.getElementById('data-pulse');
    const showcaseHub = document.querySelector('.showcase-hub');
    const showcaseNodeA = document.querySelector('.node-a');
    const showcaseNodeB = document.querySelector('.node-b');
    const showcaseNodeC = document.querySelector('.node-c');

    let isAnimating = false;

    const runPacketAnimation = (fromNode, toNode, startColor, endColor) => {
        if (isAnimating) return;
        isAnimating = true;

        const hubLeft = showcaseHub.offsetLeft;
        const hubTop = showcaseHub.offsetTop;

        // Resetar posição inicial no nó emissor
        dataPulse.style.transition = 'none';
        dataPulse.style.backgroundColor = startColor;
        dataPulse.style.boxShadow = `0 0 14px ${startColor}`;
        dataPulse.style.left = `${fromNode.offsetLeft + fromNode.offsetWidth / 2 - 8}px`;
        dataPulse.style.top = `${fromNode.offsetTop + fromNode.offsetHeight / 2 - 8}px`;
        dataPulse.style.display = 'block';

        // Animar para o Hub Central (Tradutor)
        setTimeout(() => {
            dataPulse.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            dataPulse.style.left = `${hubLeft}px`;
            dataPulse.style.top = `${hubTop}px`;
        }, 50);

        // Tradução no Hub
        setTimeout(() => {
            dataPulse.style.backgroundColor = endColor;
            dataPulse.style.boxShadow = `0 0 16px ${endColor}`;

            // Pulso visual no Hub de Integração
            showcaseHub.style.transform = 'translate(-50%, -50%) scale(1.25)';
            setTimeout(() => {
                showcaseHub.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 200);

            // Animar do Hub para o nó receptor
            dataPulse.style.left = `${toNode.offsetLeft + toNode.offsetWidth / 2 - 8}px`;
            dataPulse.style.top = `${toNode.offsetTop + toNode.offsetHeight / 2 - 8}px`;
        }, 900);

        // Finalizar animação
        setTimeout(() => {
            dataPulse.style.display = 'none';
            isAnimating = false;
        }, 1750);
    };

    if (btnTranslateAB) {
        btnTranslateAB.addEventListener('click', () => {
            runPacketAnimation(showcaseNodeA, showcaseNodeB, '#3b82f6', '#8b5cf6');
        });
    }

    if (btnTranslateCA) {
        btnTranslateCA.addEventListener('click', () => {
            runPacketAnimation(showcaseNodeC, showcaseNodeA, '#10b981', '#3b82f6');
        });
    }


    // ==========================================================================
    // ETAPA 4: MINI SIMULADOR (DECISÕES DE TRADUÇÃO)
    // ==========================================================================
    const choiceButtons = document.querySelectorAll('.choice-btn');
    const simulatorFeedback = document.getElementById('simulator-feedback');
    const feedbackTitle = document.getElementById('feedback-panel-title');
    const feedbackDesc = document.getElementById('feedback-panel-desc');
    const feedbackIcon = document.getElementById('feedback-panel-icon');
    const decisionPlug = document.getElementById('decision-plug');
    const wireStatusText = document.getElementById('wire-status-text');
    const statusWire = document.getElementById('status-wire');
    const btnNextToStage5 = document.getElementById('btn-next-to-stage5');

    choiceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = btn.getAttribute('data-choice');

            // Resetar estados das classes de botões
            choiceButtons.forEach(b => b.classList.remove('selected-correct', 'selected-error'));
            simulatorFeedback.classList.remove('hidden', 'success', 'error');

            if (choice === 'translate') {
                // CORRETO
                btn.classList.add('selected-correct');
                decisionPlug.style.borderColor = '#10b981';
                decisionPlug.style.color = '#10b981';
                decisionPlug.style.background = 'rgba(16, 185, 129, 0.15)';
                decisionPlug.innerHTML = '<i data-lucide="check-circle2"></i>';
                
                statusWire.style.background = 'linear-gradient(90deg, #3b82f6, #8b5cf6)';
                wireStatusText.textContent = 'Traduzindo JSON ➜ XML';
                wireStatusText.style.color = '#10b981';

                feedbackTitle.textContent = 'Decisão Correta! 🎉';
                feedbackDesc.textContent = 'Sensacional! Ao colocar a Integração no meio, o JSON foi convertido em XML em tempo real de forma automática. O Financeiro faturou a venda instantaneamente!';
                simulatorFeedback.classList.add('success');

                btnNextToStage5.classList.remove('hidden');

            } else if (choice === 'ignore') {
                // ERRADO
                btn.classList.add('selected-error');
                resetSimulatorPlug();
                feedbackTitle.textContent = 'Sistemas Isolados... 🚫';
                feedbackDesc.textContent = 'Errado. Se ignorarmos, os dados do pedido morrem no E-commerce. O Financeiro nunca registrará o faturamento e a empresa perde a venda.';
                simulatorFeedback.classList.add('error');

            } else if (choice === 'manual') {
                // ERRADO
                btn.classList.add('selected-error');
                resetSimulatorPlug();
                feedbackTitle.textContent = 'Trabalho Manual Ineficiente ⏳';
                feedbackDesc.textContent = 'Errado. Copiar e colar manualmente consome tempo, gera erros de digitação e não escala para centenas de pedidos diários.';
                simulatorFeedback.classList.add('error');
            }

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

    const resetSimulatorPlug = () => {
        decisionPlug.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        decisionPlug.style.color = '#94a3b8';
        decisionPlug.style.background = '#0f172a';
        decisionPlug.innerHTML = '<i data-lucide="help-circle"></i>';
        statusWire.style.background = 'rgba(255, 255, 255, 0.08)';
        wireStatusText.textContent = 'Sem Integração';
        wireStatusText.style.color = 'var(--color-text-dark)';
        btnNextToStage5.classList.add('hidden');
    };


    // ==========================================================================
    // ETAPA 5: MISSÃO RÁPIDA (QUIZ DE FIXAÇÃO)
    // ==========================================================================
    const quizPanels = document.querySelectorAll('.quiz-step-panel');
    const quizProgress = document.getElementById('quiz-progress');
    const quizFeedback = document.getElementById('quiz-feedback');
    const quizFeedbackText = document.getElementById('quiz-feedback-text');

    let currentQuizStep = 0;

    const quizAnswers = {
        0: 'xml',     // Passo 1: <cliente>
        1: 'convert', // Passo 2: Converter CSV para JSON
        2: 'json'     // Passo 3: JSON / Inglês do mundo tech
    };

    const handleQuizOptionClick = (btn, isCorrect) => {
        const parentPanel = btn.parentElement;
        const siblingButtons = parentPanel.querySelectorAll('.quiz-opt-btn');

        // Bloquear novas tentativas no mesmo painel enquanto resolve
        siblingButtons.forEach(b => b.style.pointerEvents = 'none');

        if (isCorrect) {
            btn.classList.add('correct');
            quizFeedback.className = 'quiz-feedback-box correct';
            quizFeedbackText.textContent = 'Muito bem! Resposta correta.';
            quizFeedback.classList.remove('hidden');

            setTimeout(() => {
                advanceQuiz();
            }, 1500);

        } else {
            btn.classList.add('incorrect');
            quizFeedback.className = 'quiz-feedback-box incorrect';
            quizFeedbackText.textContent = 'Ops, tente novamente!';
            quizFeedback.classList.remove('hidden');

            // Liberar opções após curto intervalo para nova tentativa
            setTimeout(() => {
                siblingButtons.forEach(b => b.style.pointerEvents = 'auto');
                btn.classList.remove('incorrect');
                quizFeedback.classList.add('hidden');
            }, 1200);
        }
    };

    // Configurar listeners de clique do Quiz
    quizPanels.forEach((panel, stepIndex) => {
        const optionButtons = panel.querySelectorAll('.quiz-opt-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const selection = btn.getAttribute('data-answer');
                const isCorrect = selection === quizAnswers[stepIndex];
                handleQuizOptionClick(btn, isCorrect);
            });
        });
    });

    const advanceQuiz = () => {
        quizFeedback.classList.add('hidden');
        quizPanels[currentQuizStep].classList.remove('active-quiz-panel');
        
        currentQuizStep++;

        // Atualizar barra de progresso do quiz
        const progressWidth = ((currentQuizStep + 1) / quizPanels.length) * 100;
        if (quizProgress) {
            quizProgress.style.width = `${progressWidth}%`;
        }

        if (currentQuizStep < quizPanels.length) {
            quizPanels[currentQuizStep].classList.add('active-quiz-panel');
        } else {
            // QUIZ COMPLETOU! Avançar para a conclusão (Stage 6)
            scrollToSection('stage6');
        }
    };


    // ==========================================================================
    // ETAPA 6: GRADUAÇÃO / CONCLUSÃO
    // ==========================================================================
    const btnCompleteDados = document.getElementById('btn-complete-dados');

    if (btnCompleteDados) {
        btnCompleteDados.addEventListener('click', () => {
            // Salvar estado concluído no localStorage
            localStorage.setItem('muleacademy_completed_dados', 'true');
            
            // Subir nível no localStorage caso esteja no nível 1
            const currentUser = JSON.parse(sessionStorage.getItem('muleacademy_current_user'));
            if (currentUser && currentUser.email) {
                localStorage.setItem(`muleacademy_progress_backup_${currentUser.email}`, 'level2');
            }

            // Redirecionar ao painel do curso
            window.location.href = 'dashboard.html';
        });
    }
});
