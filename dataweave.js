document.addEventListener('DOMContentLoaded', () => {
    // Inicializar ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Marca que o aluno iniciou o Módulo 3
    localStorage.setItem('muleacademy_started_dataweave', 'true');

    // ==========================================================================
    // PROGRESSÃO DE ETAPAS (NAVEGAÇÃO POR SEÇÕES E CLIQUES)
    // ==========================================================================
    const sections = document.querySelectorAll('.chapter-section');
    const stepButtons = document.querySelectorAll('.step-btn');
    const progressFill = document.getElementById('progress-fill');

    const updateProgressHeader = (activeId) => {
        let activeIndex = 0;
        sections.forEach((section, index) => {
            if (section.id === activeId) {
                activeIndex = index;
            }
        });

        // Gravar progresso intermediário conforme avança pelas seções:
        if (activeIndex >= 2) {
            localStorage.setItem('muleacademy_completed_dw_1', 'true');
        }
        if (activeIndex >= 3) {
            localStorage.setItem('muleacademy_completed_dw_2', 'true');
        }
        if (activeIndex >= 4) {
            localStorage.setItem('muleacademy_completed_dw_3', 'true');
        }

        // Atualizar classes dos botões da barra de navegação
        stepButtons.forEach((btn, index) => {
            if (index <= activeIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Atualizar barra de progresso horizontal (0% a 100%)
        const progressPercent = (activeIndex / (sections.length - 1)) * 100;
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
    };

    const scrollToSection = (targetId) => {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
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

    // Cliques nas etapas numéricas superiores
    stepButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            scrollToSection(targetId);
        });
    });

    // Cliques nos botões de avançar de cada página
    document.querySelectorAll('.next-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextId = btn.getAttribute('data-next');
            scrollToSection(nextId);
        });
    });

    // IntersectionObserver para scroll dinâmico
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
    // LÓGICA DE VALIDAÇÃO DE EXERCÍCIOS
    // ==========================================================================
    const validationButtons = document.querySelectorAll('.btn-validate');

    validationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const exerciseId = btn.getAttribute('data-exercise');
            validateExercise(exerciseId);
        });
    });

    const setStatus = (statusEl, type, text) => {
        statusEl.className = `validation-status status-${type}`;
        statusEl.innerHTML = text;
    };

    const validateExercise = (id) => {
        if (id === 'ex1') {
            const input = document.getElementById('input-ex1').value.trim();
            const statusEl = document.getElementById('status-ex1');
            
            if (input === 'payload.nome') {
                setStatus(statusEl, 'success', '<i data-lucide="check-circle" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Correto!');
                unlockExercise('ex-hw-2');
                localStorage.setItem('muleacademy_completed_dw_1', 'true');
            } else {
                setStatus(statusEl, 'error', 'Tente novamente. Dica: Para ler a chave "nome" dos dados de entrada, use "payload.nome".');
            }
        }
        else if (id === 'ex2') {
            const input = document.getElementById('input-ex2').value.trim();
            const statusEl = document.getElementById('status-ex2');
            
            if (input === 'payload.idade') {
                setStatus(statusEl, 'success', '<i data-lucide="check-circle" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Excelente! Aula 2 Concluída.');
                document.getElementById('btn-next-to-stage3').classList.remove('hidden');
                document.getElementById('practice-cta-stage2').classList.remove('hidden');
                localStorage.setItem('muleacademy_completed_dw_1', 'true');
            } else {
                setStatus(statusEl, 'error', 'Tente novamente. Dica: Use "payload.idade" para ler a idade.');
            }
        }
        else if (id === 'ex3') {
            const input = document.getElementById('input-ex3').value;
            const statusEl = document.getElementById('status-ex3');
            
            if (input === 'application/xml') {
                setStatus(statusEl, 'success', '<i data-lucide="check-circle" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Correto!');
                unlockExercise('ex-lang-4');
            } else {
                setStatus(statusEl, 'error', 'Escolha a opção XML, que corresponde ao idioma esperado.');
            }
        }
        else if (id === 'ex4') {
            const input = document.getElementById('input-ex4').value;
            const statusEl = document.getElementById('status-ex4');
            
            if (input === 'application/json') {
                setStatus(statusEl, 'success', '<i data-lucide="check-circle" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Sucesso! Aula 3 Concluída.');
                document.getElementById('btn-next-to-stage4').classList.remove('hidden');
                document.getElementById('practice-cta-stage3').classList.remove('hidden');
                localStorage.setItem('muleacademy_completed_dw_2', 'true');
            } else {
                setStatus(statusEl, 'error', 'Escolha JSON para traduzir o CSV para formato de chaves.');
            }
        }
        else if (id === 'ex5') {
            const input = document.getElementById('input-ex5').value.trim().replace(/\s+/g, '');
            const statusEl = document.getElementById('status-ex5');
            
            if (input === 'item.nome') {
                setStatus(statusEl, 'success', '<i data-lucide="check-circle" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Correto!');
                unlockExercise('ex-rule-6');
            } else {
                setStatus(statusEl, 'error', 'Dica: Acesse a chave "nome" de cada "item" da lista: "item.nome".');
            }
        }
        else if (id === 'ex6') {
            const input = document.getElementById('input-ex6').value.trim().replace(/\s+/g, '');
            const statusEl = document.getElementById('status-ex6');
            
            // Aceita item.idade>10, item.idade==20, item.idade>=18 ou item.idade>=20
            const validOptions = [
                'item.idade>10',
                'item.idade>=18',
                'item.idade>=20',
                'item.idade==20',
                'item.idade>18'
            ];
            
            if (validOptions.includes(input)) {
                setStatus(statusEl, 'success', '<i data-lucide="check-circle" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Correto!');
                unlockExercise('ex-rule-7');
            } else {
                setStatus(statusEl, 'error', 'Dica: Digite a condição para escolher apenas o item com idade 20 (ex: "item.idade > 10" ou "item.idade == 20").');
            }
        }
        else if (id === 'ex7') {
            const input = document.getElementById('input-ex7').value.trim().toLowerCase().replace(/['"]/g, '');
            const statusEl = document.getElementById('status-ex7');
            
            if (input === 'menor') {
                setStatus(statusEl, 'success', '<i data-lucide="check-circle" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> Espetacular! Aula 4 Concluída.');
                document.getElementById('btn-next-to-stage5').classList.remove('hidden');
                document.getElementById('practice-cta-stage4').classList.remove('hidden');
                localStorage.setItem('muleacademy_completed_dw_3', 'true');
            } else {
                setStatus(statusEl, 'error', 'Dica: Retorne o texto "menor" (entre aspas).');
            }
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    const unlockExercise = (boxId) => {
        const box = document.getElementById(boxId);
        if (box) {
            box.classList.remove('locked-ex');
            const inputs = box.querySelectorAll('input, select');
            inputs.forEach(input => input.removeAttribute('disabled'));
            const btns = box.querySelectorAll('button');
            btns.forEach(btn => btn.removeAttribute('disabled'));
            
            const statusEl = box.querySelector('.validation-status');
            if (statusEl) {
                statusEl.className = 'validation-status status-pending';
                statusEl.textContent = 'Pronto para teste.';
            }
        }
    };

    // Preenche e destrava automaticamente caso o estudante já tenha feito no passado
    const restoreProgress = () => {
        if (localStorage.getItem('muleacademy_completed_dw_1') === 'true') {
            document.getElementById('input-ex1').value = 'payload.nome';
            validateExercise('ex1');
            document.getElementById('input-ex2').value = 'payload.idade';
            validateExercise('ex2');
        }
        if (localStorage.getItem('muleacademy_completed_dw_2') === 'true') {
            document.getElementById('input-ex3').value = 'application/xml';
            validateExercise('ex3');
            document.getElementById('input-ex4').value = 'application/json';
            validateExercise('ex4');
        }
        if (localStorage.getItem('muleacademy_completed_dw_3') === 'true') {
            document.getElementById('input-ex5').value = 'item.nome';
            validateExercise('ex5');
            document.getElementById('input-ex6').removeAttribute('disabled');
            document.getElementById('input-ex6').value = 'item.idade == 20';
            validateExercise('ex6');
            document.getElementById('input-ex7').removeAttribute('disabled');
            document.getElementById('input-ex7').value = '"menor"';
            validateExercise('ex7');
        }
    };
    restoreProgress();


    // ==========================================================================
    // ETAPA 5: LÓGICA DO SIMULADOR FINAL
    // ==========================================================================
    const btnRunSim = document.getElementById('btn-run-simulation');
    const feedbackBox = document.getElementById('simulator-feedback');
    const feedbackTitle = document.getElementById('feedback-panel-title');
    const feedbackDesc = document.getElementById('feedback-panel-desc');
    const feedbackIcon = document.getElementById('feedback-panel-icon');
    const outputContainer = document.getElementById('sim-output-container');

    if (btnRunSim) {
        btnRunSim.addEventListener('click', () => {
            const format = document.getElementById('sim-format').value;
            const filter = document.getElementById('sim-filter').value;
            const keyName = document.getElementById('sim-key-name').value;
            const keyAge = document.getElementById('sim-key-age').value;

            // Limpa classes anteriores de feedback
            feedbackBox.classList.remove('hidden', 'success-glow', 'error-glow');

            // Validações
            if (format !== 'application/xml') {
                showFeedback('error', 'Formato Inválido', 'Dica: O Sistema B necessita receber dados em XML. Verifique o cabeçalho "output application/xml".');
                return;
            }
            if (filter !== 'usuario.idade >= 18') {
                showFeedback('error', 'Filtro Incorreto', 'Dica: O Sistema B exige apenas maiores de idade. Verifique se o operador de comparação é maior ou igual (>= 18).');
                return;
            }
            if (keyName !== 'name') {
                showFeedback('error', 'Chave Incorreta', 'Dica: A especificação do Sistema B solicita o mapeamento de "nome" para "name" (chave de destino).');
                return;
            }
            if (keyAge !== 'age') {
                showFeedback('error', 'Chave Incorreta', 'Dica: A especificação solicita o mapeamento da idade para "age" (chave de destino).');
                return;
            }

            // SE TUDO ESTIVER CORRETO: SUCESSO!
            showFeedback('success', 'Tradução Perfeita! 🎉', 'Excelente trabalho! Os dados em JSON foram filtrados (eliminando o Bruno, menor de idade) e traduzidos perfeitamente em XML estruturado para o Sistema B.');
            
            // Exibir código XML traduzido no painel de saída
            outputContainer.innerHTML = `<pre><code>&lt;pessoas&gt;
  &lt;pessoa&gt;
    &lt;name&gt;Ana&lt;/name&gt;
    &lt;age&gt;25&lt;/age&gt;
  &lt;/pessoa&gt;
  &lt;pessoa&gt;
    &lt;name&gt;Carlos&lt;/name&gt;
    &lt;age&gt;42&lt;/age&gt;
  &lt;/pessoa&gt;
&lt;/pessoas&gt;</code></pre>`;

            // Desbloquear botão para avançar
            document.getElementById('btn-next-to-stage6').classList.remove('hidden');
        });
    }

    const showFeedback = (type, title, desc) => {
        feedbackBox.classList.remove('hidden');
        feedbackTitle.textContent = title;
        feedbackDesc.textContent = desc;

        if (type === 'success') {
            feedbackBox.classList.add('success-glow');
            feedbackBox.style.border = '1px solid var(--color-emerald)';
            feedbackIcon.setAttribute('data-lucide', 'check-circle');
            feedbackIcon.style.color = 'var(--color-emerald)';
        } else {
            feedbackBox.classList.add('error-glow');
            feedbackBox.style.border = '1px solid var(--color-rose)';
            feedbackIcon.setAttribute('data-lucide', 'alert-triangle');
            feedbackIcon.style.color = 'var(--color-rose)';
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };


    // ==========================================================================
    // ETAPA 6: GRADUAÇÃO / CONCLUSÃO DO MÓDULO
    // ==========================================================================
    const btnCompleteDW = document.getElementById('btn-complete-dataweave');

    if (btnCompleteDW) {
        btnCompleteDW.addEventListener('click', () => {
            // Salvar estado concluído no localStorage
            localStorage.setItem('muleacademy_completed_dataweave', 'true');
            
            // Subir nível no localStorage
            const currentUser = JSON.parse(sessionStorage.getItem('muleacademy_current_user'));
            if (currentUser && currentUser.email) {
                // Caso estivesse nível 2, avança para o nível 3
                localStorage.setItem(`muleacademy_progress_backup_${currentUser.email}`, 'level3');
            }

            // Redirecionar ao painel do curso
            window.location.href = 'dashboard.html';
        });
    }
});
