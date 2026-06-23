// ==========================================================================
// MULEACADEMY - LOGIN & SISTEMA ADMINISTRATIVO (LOGIC ENGINE)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // Inicializa ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       1. MOTOR INTERATIVO DO CANVAS DE CONSTELAÇÃO (PLAYGROUND DE REDE E APIS)
       ========================================================================== */
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const maxParticles = 80;
    const connectionDist = 110;
    const mouse = { x: null, y: null, radius: 165 };

    // Captura eventos do mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Ajusta o tamanho do canvas no redimensionamento da janela
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    // Classe para representar cada nó de dados
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4; // Velocidade lenta de deriva
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1.2;
            // Cores baseadas nos formatos de dados da MuleAcademy (indigo, teal, accent, json)
            const colors = ['#6366f1', '#14b8a6', '#8b5cf6', '#f97316'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            // Movimentação básica
            this.x += this.vx;
            this.y += this.vy;

            // Rebate nas bordas
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Física de repulsão em relação ao mouse
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Afasta o nó na direção oposta ao mouse
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // Reseta sombra
        }
    }

    // Inicializa a lista de partículas
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    // Desenha as linhas entre os nós e com o mouse
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];

            // 1. Conexão entre partículas
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    const opacity = (1 - dist / connectionDist) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // 2. Conexão das partículas com o cursor do mouse
            if (mouse.x !== null) {
                const dx = p1.x - mouse.x;
                const dy = p1.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const opacity = (1 - dist / mouse.radius) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`; // Cor teal para conexões do mouse
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Efeito de pulso de dados correndo na direção do mouse
                    if (Math.random() < 0.04) {
                        ctx.beginPath();
                        const progress = Math.random();
                        const px = p1.x - dx * progress;
                        const py = p1.y - dy * progress;
                        ctx.arc(px, py, 2, 0, Math.PI * 2);
                        ctx.fillStyle = '#2dd4bf';
                        ctx.shadowBlur = 5;
                        ctx.shadowColor = '#2dd4bf';
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
            }
        }
    }

    // Loop de animação contínua (60 FPS)
    function animateNetwork() {
        ctx.clearRect(0, 0, width, height);

        drawConnections();

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateNetwork);
    }

    animateNetwork();
    }


    /* ==========================================================================
       2. GERENCIAMENTO DE ESTADO E BANCO DE MOCKS (LOCALSTORAGE)
       ========================================================================== */
    
    // Inicialização de usuários alunos fictícios para demonstração do admin
    const defaultStudents = [
        { name: "João Silva", email: "joao@email.com", password: "user123", active: true, signupDate: "2026-06-18" },
        { name: "Maria Oliveira", email: "maria@email.com", password: "user123", active: true, signupDate: "2026-06-19" },
        { name: "Carlos Souza", email: "carlos@email.com", password: "user123", active: false, signupDate: "2026-06-15" },
        { name: "Aluno de Estudos", email: "estudo@email.com", password: "user123", active: true, signupDate: "2026-06-22" }
    ];

    // Se não existirem usuários, inicializa mock
    if (!localStorage.getItem('muleacademy_users')) {
        localStorage.setItem('muleacademy_users', JSON.stringify(defaultStudents));
        
        // Simular o progresso no localStorage para João e Maria para fins de relatório visual no admin
        localStorage.setItem('muleacademy_progress_joao@email.com', 'muleacademy_completed_1=true;muleacademy_completed_2=true;muleacademy_completed_3=true;');
        localStorage.setItem('muleacademy_progress_maria@email.com', 'muleacademy_completed_1=true;');
    } else {
        // Garantir que o usuário de estudos exista na base mesmo se já foi inicializada antes
        try {
            const currentUsers = JSON.parse(localStorage.getItem('muleacademy_users'));
            if (Array.isArray(currentUsers) && !currentUsers.some(u => u.email === 'estudo@email.com')) {
                currentUsers.push({ name: "Aluno de Estudos", email: "estudo@email.com", password: "user123", active: true, signupDate: "2026-06-22" });
                localStorage.setItem('muleacademy_users', JSON.stringify(currentUsers));
            }
        } catch (e) {
            console.error("Erro ao sincronizar usuário de estudos no localStorage:", e);
        }
    }

    // Helper function to hash a password using SHA-256
    async function hashPassword(password) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Configuração de senha Admin padrão (armazenada com hash SHA-256)
    const defaultAdminHash = 'a6563a56ce7603365074a939695cc0e8166b149a1f74c3f5a1dc4bf8642b2eda'; // hash de ####admin123
    
    // Migração automática de senhas antigas em texto plano
    const oldPlainAdminPassword = localStorage.getItem('muleacademy_admin_password');
    if (oldPlainAdminPassword) {
        if (oldPlainAdminPassword === 'admin123' || oldPlainAdminPassword === '####admin123') {
            localStorage.setItem('muleacademy_admin_password_hash', defaultAdminHash);
        } else {
            hashPassword(oldPlainAdminPassword).then(hash => {
                localStorage.setItem('muleacademy_admin_password_hash', hash);
            });
        }
        localStorage.removeItem('muleacademy_admin_password');
    }

    if (!localStorage.getItem('muleacademy_admin_password_hash')) {
        localStorage.setItem('muleacademy_admin_password_hash', defaultAdminHash);
    }

    // Obtém usuários da base local
    function getUsers() {
        return JSON.parse(localStorage.getItem('muleacademy_users')) || [];
    }

    // Salva usuários na base local
    function saveUsers(users) {
        localStorage.setItem('muleacademy_users', JSON.stringify(users));
    }


    /* ==========================================================================
       3. INTERAÇÕES E FLUXO DE LOGIN/CADASTRO DE ALUNOS
       ========================================================================== */
    const authCard = document.getElementById('auth-card');
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegisterBtn = document.getElementById('tab-register-btn');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const authAlert = document.getElementById('auth-alert');

    // Trocar abas da autenticação
    tabLoginBtn.addEventListener('click', () => {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        formLogin.classList.remove('hidden');
        formRegister.classList.add('hidden');
        clearAlert(authAlert);
    });

    tabRegisterBtn.addEventListener('click', () => {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        formRegister.classList.remove('hidden');
        formLogin.classList.add('hidden');
        clearAlert(authAlert);
    });

    // Função auxiliar para exibir alertas
    function showAlert(element, message, type = 'success') {
        element.textContent = message;
        element.className = `auth-alert ${type}`;
        element.classList.remove('hidden');
    }

    function clearAlert(element) {
        element.classList.add('hidden');
        element.textContent = '';
    }

    // Toggle de visibilidade da senha (show/hide password)
    document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

    // Ação: LOGIN DE USUÁRIO / ADMIN
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAlert(authAlert);

        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;

        // Credenciais fixas de Admin
        const adminEmail = 'admin@curso.com';

        if (email === adminEmail) {
            const adminSavedHash = localStorage.getItem('muleacademy_admin_password_hash') || 'a6563a56ce7603365074a939695cc0e8166b149a1f74c3f5a1dc4bf8642b2eda';
            const inputHash = await hashPassword(password);

            if (inputHash === adminSavedHash) {
                // Logado com sucesso como ADMIN
                addAccessLog('admin@curso.com', 'Login de Admin (Sucesso)', 'sucesso');
                showAlert(authAlert, 'Acesso de administrador confirmado! Carregando painel...', 'success');
                setTimeout(() => {
                    authCard.classList.add('hidden');
                    document.getElementById('admin-portal').classList.remove('hidden');
                    loadAdminDashboard();
                    clearAlert(authAlert);
                }, 1000);
            } else {
                addAccessLog('admin@curso.com', 'Tentativa de Login Admin (Senha Incorreta)', 'falha');
                showAlert(authAlert, 'Senha incorreta para o administrador.', 'error');
            }
            return;
        }

        // Login de Aluno
        const users = getUsers();
        const student = users.find(u => u.email.toLowerCase() === email);

        if (student) {
            if (student.password === password) {
                if (!student.active) {
                    addAccessLog(student.email, 'Tentativa de Login (Acesso Desativado)', 'falha');
                    showAlert(authAlert, 'Acesso desativado pelo administrador. Entre em contato para liberação.', 'error');
                    return;
                }

                // Salva usuário ativo na sessão do sessionStorage
                sessionStorage.setItem('muleacademy_current_user', JSON.stringify({
                    name: student.name,
                    email: student.email
                }));

                // Carrega o progresso específico deste aluno de volta nas chaves reais se houver backup
                restoreStudentProgress(student.email);

                addAccessLog(student.email, 'Login de Aluno (Sucesso)', 'sucesso');
                showAlert(authAlert, `Bem-vindo de volta, ${student.name}! Redirecionando...`, 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);

            } else {
                addAccessLog(student.email, 'Tentativa de Login (Senha Incorreta)', 'falha');
                showAlert(authAlert, 'Senha incorreta. Tente novamente.', 'error');
            }
        } else {
            addAccessLog(email, 'Tentativa de Login (E-mail não Cadastrado)', 'falha');
            showAlert(authAlert, 'Nenhum aluno cadastrado com este e-mail.', 'error');
        }
    });

    // Ação: REGISTRO DE ALUNO
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAlert(authAlert);

        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const password = document.getElementById('reg-password').value;

        if (password.length < 6) {
            showAlert(authAlert, 'A senha deve conter pelo menos 6 caracteres.', 'error');
            return;
        }

        const users = getUsers();
        
        // Bloquear cadastro de emails iguais ao do admin
        if (email === 'admin@curso.com') {
            addAccessLog(email, 'Tentativa de Cadastro (E-mail Reservado)', 'falha');
            showAlert(authAlert, 'Este endereço de e-mail é reservado para a administração.', 'error');
            return;
        }

        const emailExists = users.some(u => u.email.toLowerCase() === email);
        if (emailExists) {
            addAccessLog(email, 'Tentativa de Cadastro (E-mail Duplicado)', 'falha');
            showAlert(authAlert, 'Este endereço de e-mail já está cadastrado.', 'error');
            return;
        }

        // Adiciona novo aluno ativo
        const newUser = {
            name: name,
            email: email,
            password: password,
            active: true,
            signupDate: new Date().toISOString().split('T')[0]
        };

        users.push(newUser);
        saveUsers(users);

        addAccessLog(newUser.email, 'Novo Cadastro de Aluno', 'sucesso');
        showAlert(authAlert, 'Cadastro realizado com sucesso! Alternando para login...', 'success');
        setTimeout(() => {
            formRegister.reset();
            tabLoginBtn.click();
            document.getElementById('login-email').value = email;
        }, 1500);
    });

    // Função de backup do progresso do aluno quando loga
    function restoreStudentProgress(email) {
        const backupKey = `muleacademy_progress_${email}`;
        const backup = localStorage.getItem(backupKey);
        
        // Primeiro limpa o progresso anterior de outros logins
        for (let i = 1; i <= 5; i++) {
            localStorage.removeItem(`muleacademy_completed_${i}`);
        }

        if (backup) {
            // Restaura chaves de progresso (ex: "muleacademy_completed_1=true;muleacademy_completed_2=true;")
            const items = backup.split(';');
            items.forEach(item => {
                if (item) {
                    const [k, v] = item.split('=');
                    if (k) localStorage.setItem(k, v);
                }
            });
        }
    }

    // Função de backup do progresso para todos os alunos na base (rodada em alterações no admin)
    function saveStudentProgressBackup(email) {
        const backupKey = `muleacademy_progress_${email}`;
        let backupStr = '';
        for (let i = 1; i <= 5; i++) {
            const completed = localStorage.getItem(`muleacademy_completed_${i}`);
            if (completed === 'true') {
                backupStr += `muleacademy_completed_${i}=true;`;
            }
        }
        if (backupStr) {
            localStorage.setItem(backupKey, backupStr);
        }
    }


    // Função para registrar logs de acesso no localStorage
    function addAccessLog(email, action, status) {
        try {
            const logs = JSON.parse(localStorage.getItem('muleacademy_access_logs')) || [];
            
            // Cria um novo log formatado
            const newLog = {
                timestamp: new Date().toISOString(),
                email: email,
                action: action,
                status: status,
                userAgent: navigator.userAgent
            };
            
            // Adiciona no início do array
            logs.unshift(newLog);
            
            // Limita a 100 registros
            if (logs.length > 100) {
                logs.splice(100);
            }
            
            localStorage.setItem('muleacademy_access_logs', JSON.stringify(logs));
        } catch (e) {
            console.error("Erro ao salvar log de acesso:", e);
        }
    }

    // Tradução amigável do User Agent
    function getFriendlyUserAgent(ua) {
        if (!ua) return "Desconhecido";
        let os = "Outro OS";
        if (ua.includes("Windows NT 10.0")) os = "Windows 10/11";
        else if (ua.includes("Windows NT 6.1")) os = "Windows 7";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
        else if (ua.includes("Macintosh")) os = "macOS";
        else if (ua.includes("Linux")) os = "Linux";

        let browser = "Outro";
        if (ua.includes("Firefox/")) browser = "Firefox";
        else if (ua.includes("Edg/")) browser = "Edge";
        else if (ua.includes("Chrome/")) browser = "Chrome";
        else if (ua.includes("Safari/")) browser = "Safari";
        
        return `${browser} (${os})`;
    }

    // Renderizar tabela de logs
    function renderLogsTable() {
        const tbody = document.getElementById('logs-table-body');
        if (!tbody) return;

        const logs = JSON.parse(localStorage.getItem('muleacademy_access_logs')) || [];
        tbody.innerHTML = '';

        if (logs.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="4">Nenhum log de acesso registrado no momento.</td>
                </tr>
            `;
            return;
        }

        logs.forEach(log => {
            const tr = document.createElement('tr');
            
            let formattedDate = "";
            try {
                const dateObj = new Date(log.timestamp);
                formattedDate = dateObj.toLocaleString('pt-BR');
            } catch (err) {
                formattedDate = log.timestamp;
            }

            let badgeClass = "badge-log-info";
            if (log.status === "sucesso") badgeClass = "badge-log-success";
            else if (log.status === "falha") badgeClass = "badge-log-fail";

            const friendlyUA = getFriendlyUserAgent(log.userAgent);

            tr.innerHTML = `
                <td><span class="font-mono text-muted small-desc">${formattedDate}</span></td>
                <td><span class="student-meta-name">${escapeHtml(log.email)}</span></td>
                <td>
                    <span class="badge-log ${badgeClass}">
                        <span>${escapeHtml(log.action)}</span>
                    </span>
                </td>
                <td><span class="text-muted small-desc" title="${escapeHtml(log.userAgent)}">${escapeHtml(friendlyUA)}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }


    /* ==========================================================================
       4. LOGICA DO PAINEL ADMINISTRATIVO (ADMIN CONSOLE)
       ========================================================================== */
    const navStudentsBtn = document.getElementById('nav-students-btn');
    const navSettingsBtn = document.getElementById('nav-settings-btn');
    const navLogsBtn = document.getElementById('nav-logs-btn');
    const adminSectionStudents = document.getElementById('admin-section-students');
    const adminSectionSettings = document.getElementById('admin-section-settings');
    const adminSectionLogs = document.getElementById('admin-section-logs');

    // Navegação interna do Admin
    function switchAdminTab(activeBtn, activeSection) {
        [navStudentsBtn, navSettingsBtn, navLogsBtn].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        [adminSectionStudents, adminSectionSettings, adminSectionLogs].forEach(sec => {
            if (sec) sec.classList.add('hidden');
        });
        
        activeBtn.classList.add('active');
        activeSection.classList.remove('hidden');
    }

    if (navStudentsBtn) {
        navStudentsBtn.addEventListener('click', () => {
            switchAdminTab(navStudentsBtn, adminSectionStudents);
        });
    }

    if (navSettingsBtn) {
        navSettingsBtn.addEventListener('click', () => {
            switchAdminTab(navSettingsBtn, adminSectionSettings);
            clearAlert(document.getElementById('settings-alert'));
        });
    }

    if (navLogsBtn) {
        navLogsBtn.addEventListener('click', () => {
            switchAdminTab(navLogsBtn, adminSectionLogs);
            renderLogsTable();
        });
    }

    // Botão Limpar Logs
    const btnClearLogs = document.getElementById('btn-clear-logs');
    if (btnClearLogs) {
        btnClearLogs.addEventListener('click', () => {
            if (confirm("Deseja realmente limpar todos os logs de atividade? Esta ação não pode ser desfeita.")) {
                localStorage.setItem('muleacademy_access_logs', JSON.stringify([]));
                addAccessLog('admin@curso.com', 'Logs de atividades limpos', 'info');
                renderLogsTable();
            }
        });
    }

    // Logout do Admin
    document.getElementById('btn-admin-logout').addEventListener('click', () => {
        addAccessLog('admin@curso.com', 'Logout de Admin', 'info');
        document.getElementById('admin-portal').classList.add('hidden');
        authCard.classList.remove('hidden');
        formLogin.reset();
    });

    // Login rápido de administrador na visualização do aluno
    document.getElementById('btn-admin-to-student').addEventListener('click', () => {
        addAccessLog('admin@curso.com', 'Acesso rápido à Área do Aluno', 'info');
        // Define usuário atual como o admin de testes
        sessionStorage.setItem('muleacademy_current_user', JSON.stringify({
            name: 'Administrador',
            email: 'admin@curso.com'
        }));
        
        // Restaura o progresso do admin se houver, senão mantém
        restoreStudentProgress('admin@curso.com');

        window.location.href = 'dashboard.html';
    });

    // Carregamento do Painel de Controle e Estatísticas
    function loadAdminDashboard() {
        const users = getUsers();
        const activeUsersCount = users.filter(u => u.active).length;
        
        // Calcula progresso médio de todos os alunos cadastrados
        let totalProgressPercent = 0;
        let completions = 0;

        users.forEach(user => {
            const userPercent = getStudentProgressPercent(user.email);
            totalProgressPercent += userPercent;
            if (userPercent === 100) completions++;
        });

        // Preenche indicadores nos Stats Cards
        document.getElementById('stat-total-users').textContent = users.length;
        document.getElementById('stat-active-users').textContent = activeUsersCount;
        document.getElementById('stat-completed-courses').textContent = completions;

        renderStudentsTable(users);
    }

    // Calcula o progresso do aluno baseado nos backups de progresso
    function getStudentProgressPercent(email) {
        const backup = localStorage.getItem(`muleacademy_progress_${email}`);
        
        // Caso seja o usuário atualmente logado, lê as chaves diretas do sessionStorage
        const currentUser = JSON.parse(sessionStorage.getItem('muleacademy_current_user'));
        if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
            let directCount = 0;
            for (let i = 1; i <= 5; i++) {
                if (localStorage.getItem(`muleacademy_completed_${i}`) === 'true') {
                    directCount++;
                }
            }
            return directCount * 20;
        }

        if (!backup) return 0;
        
        let completedCount = 0;
        for (let i = 1; i <= 5; i++) {
            if (backup.includes(`muleacademy_completed_${i}=true`)) {
                completedCount++;
            }
        }
        return completedCount * 20;
    }

    // Renderizar tabela de estudantes
    function renderStudentsTable(usersList) {
        const tbody = document.getElementById('students-table-body');
        tbody.innerHTML = '';

        if (usersList.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="5">Nenhum aluno cadastrado correspondente à busca.</td>
                </tr>
            `;
            return;
        }

        usersList.forEach((student, index) => {
            const progress = getStudentProgressPercent(student.email);
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>
                    <div class="student-meta-cell">
                        <span class="student-meta-name">${escapeHtml(student.name)}</span>
                        <span class="student-meta-email">${student.signupDate ? 'Registrado em: ' + student.signupDate : ''}</span>
                    </div>
                </td>
                <td><span class="text-muted font-mono">${escapeHtml(student.email)}</span></td>
                <td>
                    <div class="progress-cell-wrapper">
                        <div class="progress-track">
                            <div class="progress-fill-bar" style="width: ${progress}%;"></div>
                        </div>
                        <span class="progress-percent-lbl">${progress}%</span>
                    </div>
                </td>
                <td>
                    <span class="badge-status ${student.active ? 'active' : 'inactive'}">
                        <span class="status-dot"></span>
                        <span>${student.active ? 'Ativo' : 'Inativo'}</span>
                    </span>
                </td>
                <td>
                    <div class="actions-buttons-cell">
                        <button class="action-btn btn-action-toggle" data-index="${index}" title="${student.active ? 'Desativar Acesso' : 'Ativar Acesso'}">
                            <i data-lucide="${student.active ? 'shield-off' : 'shield-check'}"></i>
                        </button>
                        <button class="action-btn btn-action-edit" data-index="${index}" title="Editar Dados / Senha">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="action-btn btn-action-delete" data-index="${index}" title="Excluir Aluno">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Registrar escutas de cliques em botões na tabela
        registerTableActions();

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Auxiliar contra XSS
    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // Configuração de pesquisa/busca na tabela
    const searchInput = document.getElementById('table-search');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const users = getUsers();
        
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(query) || 
            user.email.toLowerCase().includes(query)
        );
        
        renderStudentsTable(filtered);
    });

    // Registro das Ações de botões na tabela
    function registerTableActions() {
        const users = getUsers();

        // 1. Alternar Status (Ativo/Inativo)
        document.querySelectorAll('.btn-action-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                users[idx].active = !users[idx].active;
                saveUsers(users);
                addAccessLog('admin@curso.com', `${users[idx].active ? 'Ativou' : 'Desativou'} acesso do aluno: ${users[idx].email}`, 'info');
                loadAdminDashboard();
            });
        });

        // 2. Editar dados (Abrir modal)
        document.querySelectorAll('.btn-action-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                const student = users[idx];

                document.getElementById('edit-user-index').value = idx;
                document.getElementById('edit-user-name').value = student.name;
                document.getElementById('edit-user-email').value = student.email;
                document.getElementById('edit-user-password').value = ''; // limpa placeholder

                clearAlert(document.getElementById('modal-alert'));
                document.getElementById('modal-edit-user').classList.remove('hidden');
            });
        });

        // 3. Excluir Aluno
        document.querySelectorAll('.btn-action-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                const student = users[idx];
                
                if (confirm(`Deseja realmente remover permanentemente o aluno "${student.name}" do sistema?`)) {
                    // Remove também o backup de progresso correspondente
                    localStorage.removeItem(`muleacademy_progress_${student.email}`);
                    
                    addAccessLog('admin@curso.com', `Excluiu aluno: ${student.email}`, 'info');
                    users.splice(idx, 1);
                    saveUsers(users);
                    loadAdminDashboard();
                }
            });
        });
    }

    // Modal Control: Fechar Modal
    const modalEditUser = document.getElementById('modal-edit-user');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');

    const closeModal = () => {
        modalEditUser.classList.add('hidden');
    };

    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);

    // Modal Ação: Submissão da Edição
    document.getElementById('form-edit-user').addEventListener('submit', (e) => {
        e.preventDefault();
        const modalAlert = document.getElementById('modal-alert');
        clearAlert(modalAlert);

        const idx = parseInt(document.getElementById('edit-user-index').value);
        const name = document.getElementById('edit-user-name').value.trim();
        const email = document.getElementById('edit-user-email').value.trim().toLowerCase();
        const newPassword = document.getElementById('edit-user-password').value;

        const users = getUsers();

        // Validar e-mail duplicado
        if (email === 'admin@curso.com') {
            showAlert(modalAlert, 'Endereço de e-mail reservado para o administrador.', 'error');
            return;
        }

        const emailExists = users.some((u, i) => u.email.toLowerCase() === email && i !== idx);
        if (emailExists) {
            showAlert(modalAlert, 'Este endereço de e-mail já está sendo usado por outro aluno.', 'error');
            return;
        }

        // Salvar alterações
        const oldEmail = users[idx].email;
        users[idx].name = name;
        users[idx].email = email;
        if (newPassword.trim() !== '') {
            if (newPassword.length < 6) {
                showAlert(modalAlert, 'A nova senha deve conter pelo menos 6 caracteres.', 'error');
                return;
            }
            users[idx].password = newPassword;
        }

        // Se o email mudou, renomeia a chave de backup do progresso do aluno no localstorage
        if (oldEmail.toLowerCase() !== email.toLowerCase()) {
            const oldBackup = localStorage.getItem(`muleacademy_progress_${oldEmail}`);
            if (oldBackup) {
                localStorage.setItem(`muleacademy_progress_${email}`, oldBackup);
                localStorage.removeItem(`muleacademy_progress_${oldEmail}`);
            }
        }

        saveUsers(users);
        addAccessLog('admin@curso.com', `Editou dados do aluno: ${email}`, 'info');
        showAlert(modalAlert, 'Dados do aluno salvos com sucesso!', 'success');
        
        setTimeout(() => {
            closeModal();
            loadAdminDashboard();
        }, 1000);
    });

    // Ação: Alteração da Senha Mestre do Administrador
    document.getElementById('form-admin-password').addEventListener('submit', async (e) => {
        e.preventDefault();
        const settingsAlert = document.getElementById('settings-alert');
        clearAlert(settingsAlert);

        const currPwd = document.getElementById('admin-curr-pwd').value;
        const newPwd = document.getElementById('admin-new-pwd').value;
        const confPwd = document.getElementById('admin-conf-pwd').value;

        const savedAdminHash = localStorage.getItem('muleacademy_admin_password_hash') || 'a6563a56ce7603365074a939695cc0e8166b149a1f74c3f5a1dc4bf8642b2eda';
        const currHash = await hashPassword(currPwd);

        if (currHash !== savedAdminHash) {
            addAccessLog('admin@curso.com', 'Falha ao alterar senha (Senha Atual Incorreta)', 'falha');
            showAlert(settingsAlert, 'A senha atual digitada está incorreta.', 'error');
            return;
        }

        if (newPwd.length < 6) {
            showAlert(settingsAlert, 'A nova senha deve conter pelo menos 6 caracteres.', 'error');
            return;
        }

        if (newPwd !== confPwd) {
            showAlert(settingsAlert, 'A confirmação de senha não confere com a nova senha.', 'error');
            return;
        }

        // Salva nova senha com hash
        const newHash = await hashPassword(newPwd);
        localStorage.setItem('muleacademy_admin_password_hash', newHash);
        addAccessLog('admin@curso.com', 'Senha de Admin alterada com sucesso', 'info');
        showAlert(settingsAlert, 'Senha do administrador alterada com sucesso!', 'success');
        document.getElementById('form-admin-password').reset();
    });

});
