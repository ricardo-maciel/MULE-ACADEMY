// ==========================================================================
// MÓDULO 2 - FORMATOS DE DADOS - JAVASCRIPT PRINCIPAL
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
    const sectionIds = ['hero', 'o-que-e-objeto', 'objeto-em-dados', 'conversor-interativo', 'comparativo', 'modo-api', 'simulador-erro', 'exercicio-pratico', 'conclusao'];

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
            scrollToSection('o-que-e-objeto');
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
                    localStorage.setItem('muleacademy_completed_2', 'true');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));


    /* ==========================================================================
       2. CONVERSOR INTERATIVO E MAPEAMENTO DE MOUSE (CAPÍTULO 3)
       ========================================================================== */
    const convTabBtns = document.querySelectorAll('.conv-tab-btn');
    const interactiveCodeBlock = document.getElementById('interactive-code-block');
    const termFilename = document.getElementById('term-filename');
    const termLang = document.getElementById('term-lang');
    const joaoVisualBox = document.getElementById('joao-visual-box');
    const interactiveExplanation = document.getElementById('interactive-explanation-text');
    const explanationIcon = document.getElementById('interactive-explanation').querySelector('i');

    const conversionCodes = {
        json: {
            filename: "dados_pessoa.json",
            lang: "JSON",
            code: `<span class="syntax-bracket">{</span>\n` +
                  `<span class="code-line-row" data-ref="nome">  <span class="syntax-key">"nome"</span>: <span class="syntax-val">"João"</span>,</span>\n` +
                  `<span class="code-line-row" data-ref="idade">  <span class="syntax-key">"idade"</span>: <span class="syntax-val">25</span>,</span>\n` +
                  `<span class="code-line-row" data-ref="cidade">  <span class="syntax-key">"cidade"</span>: <span class="syntax-val">"São Luís"</span></span>\n` +
                  `<span class="syntax-bracket">}</span>`,
            explanation: "JSON organiza dados em chave-valor cercados por chaves `{ }`. É extremamente leve e fácil de ler.",
            iconClass: "braces",
            themeColor: "text-json"
        },
        xml: {
            filename: "dados_pessoa.xml",
            lang: "XML",
            code: `<span class="code-line-row" data-ref="root"><span class="syntax-tag">&lt;pessoa&gt;</span></span>\n` +
                  `<span class="code-line-row" data-ref="nome">  <span class="syntax-tag">&lt;nome&gt;</span>João<span class="syntax-tag">&lt;/nome&gt;</span></span>\n` +
                  `<span class="code-line-row" data-ref="idade">  <span class="syntax-tag">&lt;idade&gt;</span>25<span class="syntax-tag">&lt;/idade&gt;</span></span>\n` +
                  `<span class="code-line-row" data-ref="cidade">  <span class="syntax-tag">&lt;cidade&gt;</span>São Luís<span class="syntax-tag">&lt;/cidade&gt;</span></span>\n` +
                  `<span class="code-line-row" data-ref="root"><span class="syntax-tag">&lt;/pessoa&gt;</span></span>`,
            explanation: "XML empacota atributos em tags personalizadas `<tag>...</tag>`. É altamente rígido e ideal para dados complexos.",
            iconClass: "file-code",
            themeColor: "text-xml"
        },
        csv: {
            filename: "dados_pessoa.csv",
            lang: "CSV",
            code: `<span class="code-line-row" data-ref="header">nome,idade,cidade</span>\n` +
                  `<span class="code-line-row" data-ref="values"><span class="syntax-val">João</span>,<span class="syntax-val">25</span>,<span class="syntax-val">São Luís</span></span>`,
            explanation: "CSV separa chaves na primeira linha e valores na segunda, separados apenas por vírgulas. Super tabular!",
            iconClass: "file-spreadsheet",
            themeColor: "text-csv"
        }
    };

    // Carrega JSON por padrão
    const loadConverterFormat = (formatKey) => {
        const data = conversionCodes[formatKey];
        if (!data) return;

        // Animação de spin/fade do card do João
        joaoVisualBox.classList.add('animating');
        
        setTimeout(() => {
            termFilename.textContent = data.filename;
            termLang.textContent = data.lang;
            interactiveCodeBlock.innerHTML = data.code;
            interactiveExplanation.textContent = data.explanation;
            
            // Corrige classe de cor do ícone explicativo
            explanationIcon.className = `exp-spark-icon ${data.themeColor}`;
            explanationIcon.setAttribute('data-lucide', data.iconClass);
            
            joaoVisualBox.classList.remove('animating');

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Recria escutas de mouse para a nova sintaxe renderizada
            attachHoverListeners(formatKey);
        }, 300);
    };

    // Adiciona escutas de hover mapeadas entre card e código
    const attachHoverListeners = (formatKey) => {
        const lines = interactiveCodeBlock.querySelectorAll('.code-line-row');
        const visFields = joaoVisualBox.querySelectorAll('.vis-field');

        // Reseta classes de hover
        visFields.forEach(f => f.classList.remove('highlight-line'));

        // Adiciona listeners para linhas do terminal
        lines.forEach(line => {
            const ref = line.getAttribute('data-ref');
            
            line.addEventListener('mouseenter', () => {
                line.classList.add('highlight-line');
                
                // Mapeia para o card visual correspondente
                const matchingField = joaoVisualBox.querySelector(`.vis-field[data-highlight="${ref}"]`);
                if (matchingField) {
                    matchingField.classList.add('highlight-line');
                }
                
                // Para CSV: se for linha de dados, destaca os campos no card
                if (ref === 'values') {
                    visFields.forEach(f => f.classList.add('highlight-line'));
                }
            });

            line.addEventListener('mouseleave', () => {
                line.classList.remove('highlight-line');
                visFields.forEach(f => f.classList.remove('highlight-line'));
            });
        });

        // Adiciona listeners para os campos do card
        visFields.forEach(field => {
            const highlightTarget = field.getAttribute('data-highlight');
            
            field.addEventListener('mouseenter', () => {
                field.classList.add('highlight-line');
                
                // Mapeia para a linha correspondente no terminal
                const matchingLine = interactiveCodeBlock.querySelector(`.code-line-row[data-ref="${highlightTarget}"]`);
                if (matchingLine) {
                    matchingLine.classList.add('highlight-line');
                }
                
                // Para CSV: destaca a linha inteira de valores
                if (formatKey === 'csv') {
                    const csvValueLine = interactiveCodeBlock.querySelector('.code-line-row[data-ref="values"]');
                    if (csvValueLine) csvValueLine.classList.add('highlight-line');
                }
            });

            field.addEventListener('mouseleave', () => {
                field.classList.remove('highlight-line');
                lines.forEach(l => l.classList.remove('highlight-line'));
            });
        });
    };

    convTabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            convTabBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const formatKey = e.currentTarget.getAttribute('data-convert');
            loadConverterFormat(formatKey);
        });
    });

    // Inicializa carregando o formato JSON
    loadConverterFormat('json');


    /* ==========================================================================
       3. SIMULAÇÃO DE ENVIO DE DADOS (MODO API - CAPÍTULO 5)
       ========================================================================== */
    const btnSimulateApi = document.getElementById('btn-simulate-api');
    const apiConsoleLog = document.getElementById('api-console-log');
    const apiNetPacket = document.getElementById('api-net-packet');
    const apiNodeClient = document.getElementById('api-node-client');
    const apiNodeServer = document.getElementById('api-node-server');
    const apiBadge201 = document.getElementById('api-badge-201');

    if (btnSimulateApi) {
        btnSimulateApi.addEventListener('click', () => {
            btnSimulateApi.disabled = true;
            apiBadge201.classList.add('hidden');
            
            apiNodeClient.classList.add('active-net-node');
            apiNodeServer.classList.remove('active-net-node', 'success-net-node');
            apiConsoleLog.textContent = 'Montando requisição HTTP POST...\nCarregando JSON do João no Body...';

            setTimeout(() => {
                // Dispara o tráfego do pacote
                apiConsoleLog.textContent = 'POST /v1/usuarios HTTP/1.1\nHost: api.loja.com\nContent-Type: application/json\n\nEnviando pacote de dados...';
                apiNetPacket.classList.add('traveling');

                setTimeout(() => {
                    // Chegada no servidor
                    apiNetPacket.classList.remove('traveling');
                    apiNodeClient.classList.remove('active-net-node');
                    apiNodeServer.classList.add('active-net-node', 'success-net-node');
                    apiBadge201.classList.remove('hidden');

                    const responsePayload = {
                        "status": "sucesso",
                        "codigo": 201,
                        "mensagem": "Cadastro do João da Silva salvo com sucesso no Servidor de Banco de Dados!"
                    };
                    
                    apiConsoleLog.textContent = `Retorno recebido do Servidor:\nHTTP/1.1 201 Created\nContent-Type: application/json\n\n` + JSON.stringify(responsePayload, null, 2);
                    
                    // Libera botões após 2s
                    setTimeout(() => {
                        btnSimulateApi.disabled = false;
                    }, 2000);

                }, 1000); // tempo de viagem do pacote

            }, 1000); // tempo de preparação do cliente
        });
    }


    /* ==========================================================================
       4. SIMULADOR DE ERRO DE SINTAXE (CAPÍTULO 6)
       ========================================================================== */
    const btnValidateError = document.getElementById('btn-validate-error');
    const btnFixError = document.getElementById('btn-fix-error');
    const errorCodePane = document.getElementById('error-code-pane');
    const errorResultAlert = document.getElementById('error-result-alert');

    if (btnValidateError) {
        btnValidateError.addEventListener('click', () => {
            btnValidateError.disabled = true;
            errorResultAlert.className = 'error-narrative-result';
            errorResultAlert.innerHTML = '<i data-lucide="loader" class="err-alert-icon spinning"></i><span>Analisando estrutura de chaves do JSON...</span>';
            if (typeof lucide !== 'undefined') lucide.createIcons();

            setTimeout(() => {
                // Revela erro de sintaxe
                errorResultAlert.className = 'error-narrative-result alert-error';
                errorResultAlert.innerHTML = '<i data-lucide="alert-triangle" class="err-alert-icon"></i><span>⚠️ Erro de Sintaxe: Formato inválido! Falta uma vírgula separando as chaves nas linhas 2 e 3.</span>';
                if (typeof lucide !== 'undefined') lucide.createIcons();

                btnValidateError.classList.add('hidden');
                btnValidateError.disabled = false;
                btnFixError.classList.remove('hidden');
            }, 1200);
        });
    }

    if (btnFixError) {
        btnFixError.addEventListener('click', () => {
            btnFixError.disabled = true;

            // Corrige código no painel de visualização
            errorCodePane.innerHTML = `1: {
2:   "nome": "João", <span class="text-json" style="font-weight:bold;">&lt;-- Vírgula Adicionada!</span>
3:   "idade": 25,
4:   "cidade": "São Luís"
5: }`;
            
            errorResultAlert.className = 'error-narrative-result alert-success';
            errorResultAlert.innerHTML = '<i data-lucide="check-circle" class="err-alert-icon"></i><span>🟢 Código Validado com Sucesso! A vírgula foi adicionada, permitindo que a API leia o objeto.</span>';
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Desabilita o fix e completa a etapa
            setTimeout(() => {
                btnFixError.classList.add('hidden');
            }, 1500);
        });
    }


    /* ==========================================================================
       5. EXERCÍCIO PRÁTICO AUTÔNOMO (CAPÍTULO 7)
       ========================================================================== */
    const exeTabBtns = document.querySelectorAll('.exe-tab-btn');
    const exerciseCodeEditor = document.getElementById('exercise-code-editor');
    const exeFilename = document.getElementById('exe-filename');
    const exeLang = document.getElementById('exe-lang');
    const btnValidateExercise = document.getElementById('btn-validate-exercise');
    const exerciseFeedback = document.getElementById('exercise-feedback');
    const exerciseFeedbackText = document.getElementById('exercise-feedback-text');

    let activeExeFormat = 'json';

    const exerciseTemplates = {
        json: {
            filename: 'carro.json',
            lang: 'JSON',
            template: '{\n  "marca": "___",\n  "modelo": "___",\n  "ano": ___\n}',
            placeholder: 'Preencha o JSON...'
        },
        xml: {
            filename: 'carro.xml',
            lang: 'XML',
            template: '<carro>\n  <marca>___</marca>\n  <modelo>___</modelo>\n  <ano>___</ano>\n</carro>',
            placeholder: 'Preencha o XML...'
        },
        csv: {
            filename: 'carro.csv',
            lang: 'CSV',
            template: 'marca,modelo,ano\n___,___,___',
            placeholder: 'Preencha o CSV...'
        }
    };

    const loadExerciseTemplate = (formatKey) => {
        activeExeFormat = formatKey;
        const data = exerciseTemplates[formatKey];
        if (data) {
            exeFilename.textContent = data.filename;
            exeLang.textContent = data.lang;
            exerciseCodeEditor.value = data.template;
            
            // Reset feedback
            exerciseFeedback.className = 'exercise-feedback-result';
            exerciseFeedbackText.textContent = 'Substitua os tracinhos "___" pelos valores corretos do Fiat Uno 2010 e valide.';
            
            const icon = exerciseFeedback.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'info');
                icon.className = 'err-alert-icon';
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    };

    // Tab buttons for exercise
    exeTabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            exeTabBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const formatKey = e.currentTarget.getAttribute('data-exe');
            loadExerciseTemplate(formatKey);
        });
    });

    // Initial load
    if (exerciseCodeEditor) {
        loadExerciseTemplate('json');
    }

    if (btnValidateExercise) {
        btnValidateExercise.addEventListener('click', () => {
            const userCode = exerciseCodeEditor.value.trim();
            
            if (activeExeFormat === 'json') {
                try {
                    const parsed = JSON.parse(userCode);
                    const brandOk = parsed.marca && parsed.marca.toString().toLowerCase() === 'fiat';
                    const modelOk = parsed.modelo && parsed.modelo.toString().toLowerCase() === 'uno';
                    const yearOk = parsed.ano && Number(parsed.ano) === 2010;

                    if (brandOk && modelOk && yearOk) {
                        showExerciseSuccess("Parabéns! Objeto JSON criado perfeitamente. O Uno digital está pronto!");
                    } else {
                        showExerciseError("JSON válido, mas os atributos não correspondem ao Uno da Fiat de 2010.");
                    }
                } catch (e) {
                    showExerciseError("Erro de Sintaxe JSON! Verifique chaves, vírgulas, aspas duplas nas propriedades e valores.");
                }
            } else if (activeExeFormat === 'xml') {
                const cleaned = userCode.replace(/\s+/g, '');
                const hasMarca = /<marca>["']?fiat["']?<\/marca>/i.test(cleaned);
                const hasModelo = /<modelo>["']?uno["']?<\/modelo>/i.test(cleaned);
                const hasAno = /<ano>2010<\/ano>/i.test(cleaned);
                const hasRoot = /<carro>.*<\/carro>/i.test(cleaned) || /<veiculo>.*<\/veiculo>/i.test(cleaned);

                if (hasMarca && hasModelo && hasAno && hasRoot) {
                    showExerciseSuccess("Parabéns! Objeto XML criado com as tags corretas e fechamento perfeito!");
                } else {
                    let msg = "Erro de Sintaxe XML!";
                    if (!hasRoot) msg += " Certifique-se de envolver tudo na tag raiz (ex: <carro>...</carro>).";
                    else if (!hasMarca) msg += " A tag <marca> deve conter 'Fiat'.";
                    else if (!hasModelo) msg += " A tag <modelo> deve conter 'Uno'.";
                    else if (!hasAno) msg += " A tag <ano> deve conter '2010'.";
                    showExerciseError(msg);
                }
            } else if (activeExeFormat === 'csv') {
                const lines = userCode.split('\n').map(l => l.trim().toLowerCase());
                if (lines.length >= 2) {
                    const header = lines[0].replace(/\s+/g, '');
                    const values = lines[1].replace(/\s+/g, '');

                    const headerOk = header === 'marca,modelo,ano' || header === 'marca;modelo;ano';
                    const valuesOk = values === 'fiat,uno,2010' || values === 'fiat;uno;2010';

                    if (headerOk && valuesOk) {
                        showExerciseSuccess("Parabéns! CSV formatado perfeitamente com cabeçalho e valores!");
                    } else {
                        showExerciseError("CSV incorreto. A primeira linha deve ser 'marca,modelo,ano' e a segunda 'Fiat,Uno,2010'.");
                    }
                } else {
                    showExerciseError("O formato CSV requer pelo menos duas linhas (cabeçalho na primeira, valores na segunda).");
                }
            }
        });
    }

    const showExerciseSuccess = (message) => {
        exerciseFeedback.className = 'exercise-feedback-result success';
        exerciseFeedbackText.textContent = message;
        const icon = exerciseFeedback.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', 'check-circle');
            icon.className = 'err-alert-icon';
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    const showExerciseError = (message) => {
        exerciseFeedback.className = 'exercise-feedback-result error';
        exerciseFeedbackText.textContent = message;
        const icon = exerciseFeedback.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', 'alert-triangle');
            icon.className = 'err-alert-icon';
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };


    /* ==========================================================================
       6. CONCLUSÃO DO MÓDULO E REDIRECIONAMENTO
       ========================================================================== */
    const btnNextModule = document.getElementById('btn-next-module');
    if (btnNextModule) {
        btnNextModule.addEventListener('click', () => {
            localStorage.setItem('muleacademy_completed_2', 'true');
            window.location.href = "modulo3.html";
        });
    }
});
