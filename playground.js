// ==========================================================================
// PLAYGROUND INTERATIVO DE INTEGRAÇÕES - LÓGICA DE FÍSICA E SIMULAÇÃO
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. AUTENTICAÇÃO E CONFIGURAÇÃO DA SESSÃO
       ========================================================================== */
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
        
        // Atualizar papel com base no progresso salvo
        let completedCount = 0;
        for (let i = 1; i <= 5; i++) {
            if (localStorage.getItem(`muleacademy_completed_${i}`) === 'true') {
                completedCount++;
            }
        }
        const profileRoleEl = document.getElementById('profile-user-role');
        if (profileRoleEl) {
            if (currentUser.email === 'admin@curso.com') {
                profileRoleEl.textContent = 'Admin 👑';
            } else if (completedCount === 5) {
                profileRoleEl.textContent = 'Graduado 🎓';
            } else {
                profileRoleEl.textContent = `Nível ${completedCount + 1}`;
            }
        }
    }

    // Configurar logout do menu lateral
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm('Deseja realmente sair da sua conta?')) {
                sessionStorage.removeItem('muleacademy_current_user');
                window.location.href = 'login.html';
            }
        });
    }

    // Configurar botão de reset do menu lateral
    const btnResetSidebar = document.getElementById('btn-reset-sidebar');
    if (btnResetSidebar) {
        btnResetSidebar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Deseja realmente resetar todo o progresso do curso?')) {
                localStorage.removeItem('muleacademy_completed_1');
                localStorage.removeItem('muleacademy_completed_2');
                localStorage.removeItem('muleacademy_completed_3');
                localStorage.removeItem('muleacademy_completed_4');
                localStorage.removeItem('muleacademy_completed_5');
                localStorage.removeItem('muleacademy_completed_dados');
                window.location.href = 'dashboard.html';
            }
        });
    }

    // Inicializa ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Lógica do Acordeão de Aulas do Sidebar
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

        // Atualizar ícones dos subitens do Módulo 2 conforme status de conclusão
        const subitemsMod2 = [
            document.getElementById('nav-sub-dataflow-1'),
            document.getElementById('nav-sub-dataflow-2'),
            document.getElementById('nav-sub-dataflow-3')
        ];
        const isMod2Completed = localStorage.getItem('muleacademy_completed_dados') === 'true';

        subitemsMod2.forEach(subitem => {
            if (subitem) {
                const iconEl = subitem.querySelector('i') || subitem.querySelector('svg');
                if (iconEl) {
                    const newIcon = document.createElement('i');
                    newIcon.setAttribute('data-lucide', isMod2Completed ? 'book-open-check' : 'play-circle');
                    iconEl.replaceWith(newIcon);
                }
            }
        });
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };
    setupSidebarAccordion();


    /* ==========================================================================
       2. EFEITOS SONOROS (WEB AUDIO API SYNTHESIZER)
       ========================================================================== */
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playBeep(frequency, duration, type = 'sine', volume = 0.1) {
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.log("AudioContext blocked or not supported by browser until user interaction.");
        }
    }

    // Efeito sonoro do Scanner laser
    function playScanSound() {
        playBeep(180, 0.4, 'sawtooth', 0.05);
        setTimeout(() => playBeep(260, 0.3, 'sawtooth', 0.05), 150);
        setTimeout(() => playBeep(440, 0.5, 'sine', 0.08), 350);
    }

    // Som de ativação / sucesso de conexão
    function playSuccessSound() {
        playBeep(523.25, 0.1, 'sine', 0.1); // C5
        setTimeout(() => playBeep(659.25, 0.1, 'sine', 0.1), 80); // E5
        setTimeout(() => playBeep(783.99, 0.25, 'sine', 0.12), 160); // G5
    }

    // Som de desconexão
    function playDisconnectSound() {
        playBeep(392, 0.1, 'triangle', 0.1);
        setTimeout(() => playBeep(293.66, 0.25, 'triangle', 0.12), 100);
    }


    /* ==========================================================================
       3. CONFIGURAÇÃO DE FÍSICA E NÓS DO PLAYGROUND
       ========================================================================== */
    const container = document.getElementById('simulator-container');
    const canvas = document.getElementById('playground-canvas');
    const ctx = canvas.getContext('2d');
    
    // Lista de nós físicos
    const nodes = [
        { id: 'mulesoft', isHub: true, name: 'MuleSoft Hub', x: 0, y: 0, vx: 0, vy: 0, radius: 48, active: true },
        { id: 'salesforce', isHub: false, name: 'Salesforce CRM', x: 0, y: 0, vx: 0, vy: 0, radius: 38, active: true },
        { id: 'shopify', isHub: false, name: 'Shopify Store', x: 0, y: 0, vx: 0, vy: 0, radius: 38, active: true },
        { id: 'stripe', isHub: false, name: 'Stripe API', x: 0, y: 0, vx: 0, vy: 0, radius: 38, active: true },
        { id: 'sap', isHub: false, name: 'SAP ERP', x: 0, y: 0, vx: 0, vy: 0, radius: 38, active: true },
        { id: 'database', isHub: false, name: 'PostgreSQL', x: 0, y: 0, vx: 0, vy: 0, radius: 38, active: true },
        { id: 'slack', isHub: false, name: 'Slack API', x: 0, y: 0, vx: 0, vy: 0, radius: 38, active: true }
    ];

    // Associar os elementos HTML existentes
    nodes.forEach(node => {
        node.element = document.getElementById(`node-${node.id}`);
    });

    let currentMode = 'p2p'; // 'p2p' ou 'hub'
    let isScanning = false;
    
    // Coordenadas do mouse
    let mouse = { x: null, y: null, active: false };
    let draggedNode = null;
    let dragOffset = { x: 0, y: 0 };

    // Pacotes de dados animados trafegando nas conexões
    let packets = [];

    // Redimensiona o canvas para caber no container
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Inicializa posições dos nós em círculo ao redor do centro
    function initNodePositions() {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        nodes.forEach((node, i) => {
            if (node.isHub) {
                node.x = cx;
                node.y = cy;
            } else {
                const angle = ((i - 1) / (nodes.length - 1)) * Math.PI * 2;
                const distance = Math.min(canvas.width, canvas.height) * 0.33;
                node.x = cx + Math.cos(angle) * distance;
                node.y = cy + Math.sin(angle) * distance;
                // Velocidade inicial randômica suave
                node.vx = (Math.random() - 0.5) * 1.2;
                node.vy = (Math.random() - 0.5) * 1.2;
            }
        });
    }
    initNodePositions();


    /* ==========================================================================
       4. MOTOR DE FÍSICA E ANIMAÇÃO
       ========================================================================== */
    const DAMPING = 0.96;         // Resistência do ar
    const MOUSE_GRAVITY = 0.08;   // Força de atração do mouse
    const ATTRACTION_DIST = 180;  // Raio de influência do mouse
    const BORDER_BOUNCE = -0.6;   // Coeficiente de restituição ao bater na borda
    const NODE_REPULSION = 0.05;  // Repulsão mútua de nós para não se sobreporem

    function updatePhysics() {
        const w = canvas.width;
        const h = canvas.height;
        
        nodes.forEach(node => {
            if (node === draggedNode) return; // Ignora física para o nó arrastado

            // Força de atração do mouse (campo gravitacional do cursor)
            if (mouse.active && mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < ATTRACTION_DIST && dist > 10) {
                    const force = (1 - dist / ATTRACTION_DIST) * MOUSE_GRAVITY;
                    node.vx += (dx / dist) * force;
                    node.vy += (dy / dist) * force;
                }
            }

            // Repulsão mútua entre nós
            nodes.forEach(other => {
                if (node === other) return;
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = node.radius + other.radius + 15;
                
                if (dist < minDist && dist > 0) {
                    const overlap = minDist - dist;
                    const force = overlap * NODE_REPULSION;
                    node.vx -= (dx / dist) * force;
                    node.vy -= (dy / dist) * force;
                }
            });

            // Se for o hub, manter flutuando muito suavemente perto do centro da tela
            if (node.isHub) {
                const cx = w / 2;
                const cy = h / 2;
                const dx = cx - node.x;
                const dy = cy - node.y;
                node.vx += dx * 0.005;
                node.vy += dy * 0.005;
            }

            // Aplicar velocidades
            node.x += node.vx;
            node.y += node.vy;

            // Damping (desaceleração gradual)
            node.vx *= DAMPING;
            node.vy *= DAMPING;

            // Restrição de limites físicos (colisão com bordas do container)
            if (node.x - node.radius < 0) {
                node.x = node.radius;
                node.vx *= BORDER_BOUNCE;
            } else if (node.x + node.radius > w) {
                node.x = w - node.radius;
                node.vx *= BORDER_BOUNCE;
            }

            if (node.y - node.radius < 0) {
                node.y = node.radius;
                node.vy *= BORDER_BOUNCE;
            } else if (node.y + node.radius > h) {
                node.y = h - node.radius;
                node.vy *= BORDER_BOUNCE;
            }

            // Sincronizar coordenadas da física com o estilo DOM absoluto
            if (node.element) {
                node.element.style.left = `${node.x - node.radius}px`;
                node.element.style.top = `${node.y - node.radius}px`;
            }
        });

        // Atualizar pacotes de dados
        updatePackets();
    }

    function updatePackets() {
        // Modo Hub: Transmissão de pacotes ordenados
        if (currentMode === 'hub') {
            // Adiciona novos pacotes aleatórios
            if (Math.random() < 0.05) {
                const activeSystems = nodes.filter(n => !n.isHub && n.active);
                if (activeSystems.length > 0) {
                    const startNode = activeSystems[Math.floor(Math.random() * activeSystems.length)];
                    const hubNode = nodes.find(n => n.isHub);
                    
                    // Direção aleatória (Upload ou Download)
                    const toHub = Math.random() < 0.5;
                    packets.push({
                        from: toHub ? startNode : hubNode,
                        to: toHub ? hubNode : startNode,
                        progress: 0,
                        speed: 0.015 + Math.random() * 0.01,
                        color: toHub ? 'rgba(20, 184, 166, 0.85)' : 'rgba(99, 102, 241, 0.85)'
                    });
                }
            }
        } 
        // Modo Ponto-a-Ponto: Pacotes caóticos cruzados
        else {
            if (Math.random() < 0.08) {
                const activeSystems = nodes.filter(n => n.active);
                if (activeSystems.length > 1) {
                    const n1 = activeSystems[Math.floor(Math.random() * activeSystems.length)];
                    let n2 = activeSystems[Math.floor(Math.random() * activeSystems.length)];
                    while (n1 === n2) {
                        n2 = activeSystems[Math.floor(Math.random() * activeSystems.length)];
                    }
                    packets.push({
                        from: n1,
                        to: n2,
                        progress: 0,
                        speed: 0.008 + Math.random() * 0.012, // mais lentos e caóticos
                        color: 'rgba(244, 63, 94, 0.7)'
                    });
                }
            }
        }

        // Avançar progresso dos pacotes e remover concluídos
        packets = packets.filter(p => {
            p.progress += p.speed;
            return p.progress < 1;
        });
    }

    /* ==========================================================================
       5. RENDERIZAÇÃO DA REDE NO CANVAS
       ========================================================================== */
    function drawNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Desenha linhas de conexão de constelação (SiteTechFinder feel)
        drawConstellationLines();

        // 2. Desenha conexões principais do modo ativo
        if (currentMode === 'p2p') {
            drawP2PConnections();
        } else {
            drawHubConnections();
        }

        // 3. Desenha pacotes de dados
        drawPackets();
    }

    // Desenha linhas do mouse em relação aos nós mais próximos
    function drawConstellationLines() {
        if (!mouse.active || mouse.x === null || mouse.y === null) return;

        // Achar os 3 nós mais próximos do cursor
        const distances = nodes.map(node => {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            return { node, dist: Math.sqrt(dx * dx + dy * dy) };
        });

        distances.sort((a, b) => a.dist - b.dist);

        // Desenhar linhas finas pontilhadas
        ctx.save();
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        
        for (let i = 0; i < Math.min(3, distances.length); i++) {
            const target = distances[i];
            if (target.dist < ATTRACTION_DIST + 50) {
                // Brilho muda com base na proximidade
                const alpha = (1 - target.dist / (ATTRACTION_DIST + 50)) * 0.25;
                ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(target.node.x, target.node.y);
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    // Modo Caótico Ponto-a-Ponto (Teia Espaguete)
    function drawP2PConnections() {
        const activeNodes = nodes.filter(n => n.active);
        
        ctx.save();
        ctx.lineWidth = 1.5;
        // Desenha uma linha entre TODOS os pares possíveis
        for (let i = 0; i < activeNodes.length; i++) {
            for (let j = i + 1; j < activeNodes.length; j++) {
                const n1 = activeNodes[i];
                const n2 = activeNodes[j];

                // Pequeno jitter visual (cintilação) nas linhas ponto-a-ponto
                const jitter = (Math.random() - 0.5) * 0.4;
                ctx.lineWidth = 1.2 + jitter;

                // Fios vermelhos semi-transparentes piscantes
                const alpha = 0.12 + Math.random() * 0.1;
                ctx.strokeStyle = `rgba(244, 63, 94, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(n1.x, n1.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    // Modo Hub-and-Spoke Limpo
    function drawHubConnections() {
        const hub = nodes.find(n => n.isHub);
        if (!hub || !hub.active) return;

        const clients = nodes.filter(n => !n.isHub && n.active);
        
        ctx.save();
        ctx.lineWidth = 2;

        clients.forEach(client => {
            // Desenha conexões azuis/teals elegantes do Hub para cada nó
            const gradient = ctx.createLinearGradient(hub.x, hub.y, client.x, client.y);
            gradient.addColorStop(0, 'rgba(20, 184, 166, 0.4)'); // Teal no Hub
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.2)'); // Indigo no Sistema
            
            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(hub.x, hub.y);
            ctx.lineTo(client.x, client.y);
            ctx.stroke();
        });
        ctx.restore();
    }

    // Desenha os pacotes (pulsos de luz que viajam)
    function drawPackets() {
        ctx.save();
        packets.forEach(p => {
            // Interpolação linear da posição
            const px = p.from.x + (p.to.x - p.from.x) * p.progress;
            const py = p.from.y + (p.to.y - p.from.y) * p.progress;
            
            // Desenhar partícula com brilho
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();

            // Glow circular
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    // Loop principal da simulação (TICK a 60 FPS)
    function simulationLoop() {
        updatePhysics();
        drawNetwork();
        requestAnimationFrame(simulationLoop);
    }
    requestAnimationFrame(simulationLoop);


    /* ==========================================================================
       6. INTERAÇÕES COM MOUSE (DRAG AND DROP, HOVER)
       ========================================================================== */
    // Captura entrada do mouse
    container.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;

        if (draggedNode) {
            // Atualiza posição do nó que está sendo arrastado direto nas coordenadas do mouse
            draggedNode.x = mouse.x - dragOffset.x;
            draggedNode.y = mouse.y - dragOffset.y;
            draggedNode.vx = 0;
            draggedNode.vy = 0;
        }
    });

    container.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
        draggedNode = null;
    });

    // Detectar mousedown nos nós para drag-and-drop
    nodes.forEach(node => {
        if (!node.element) return;
        
        node.element.addEventListener('mousedown', (e) => {
            // Impede cliques normais de causarem drag imediatamente caso clique rápido
            draggedNode = node;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            dragOffset.x = mouseX - node.x;
            dragOffset.y = mouseY - node.y;
            
            node.vx = 0;
            node.vy = 0;
            
            playBeep(440, 0.05, 'sine', 0.05); // Som de clique leve
        });
    });

    // Soltar nó e disparar velocidade baseada na inércia
    window.addEventListener('mouseup', () => {
        if (draggedNode) {
            // Fornece um impulso inicial suave na direção de descarte
            if (mouse.x !== null && mouse.y !== null) {
                draggedNode.vx = (Math.random() - 0.5) * 1.5;
                draggedNode.vy = (Math.random() - 0.5) * 1.5;
            }
            draggedNode = null;
        }
    });


    /* ==========================================================================
       7. MUDANÇA DE TOPOLOGIA (P2P VS HUB MULESOFT)
       ========================================================================== */
    const btnP2P = document.getElementById('btn-mode-p2p');
    const btnHub = document.getElementById('btn-mode-hub');

    function switchMode(newMode) {
        if (newMode === currentMode) return;
        currentMode = newMode;
        
        // Atualiza botões
        if (newMode === 'p2p') {
            btnP2P.classList.add('active');
            btnHub.classList.remove('active');
            playDisconnectSound();
        } else {
            btnHub.classList.add('active');
            btnP2P.classList.remove('active');
            playSuccessSound();
        }

        // Limpa pacotes
        packets = [];

        // Atualiza Telemetria
        updateTelemetry();
    }

    btnP2P.addEventListener('click', () => switchMode('p2p'));
    btnHub.addEventListener('click', () => switchMode('hub'));


    /* ==========================================================================
       8. ATUALIZADOR DINÂMICO DE TELEMETRIA
       ========================================================================== */
    const telConnections = document.getElementById('tel-connections');
    const telConnectionsSub = document.getElementById('tel-connections-sub');
    const telLatency = document.getElementById('tel-latency');
    const telLatencySub = document.getElementById('tel-latency-sub');
    const telMaintenance = document.getElementById('tel-maintenance');
    const telMaintenanceSub = document.getElementById('tel-maintenance-sub');
    const telSuccess = document.getElementById('tel-success');
    const telSuccessSub = document.getElementById('tel-success-sub');
    const alertBox = document.getElementById('telemetry-alert-box');

    function updateTelemetry() {
        const activeSystems = nodes.filter(n => !n.isHub && n.active).length;
        
        if (currentMode === 'p2p') {
            // Ponto a ponto: n*(n-1)/2 conexões
            const connectionsCount = Math.round((activeSystems * (activeSystems - 1)) / 2);
            telConnections.textContent = connectionsCount;
            telConnectionsSub.textContent = connectionsCount > 10 ? 'Complexidade Alta' : 'Complexidade Média';
            telConnectionsSub.className = 'tel-sub text-rose';
            
            // Latência alta e instável
            const latVal = Math.round(180 + activeSystems * 30 + Math.random() * 15);
            telLatency.textContent = `${latVal}ms`;
            telLatencySub.textContent = 'Risco de Timeout';
            telLatencySub.className = 'tel-sub text-rose';
            
            // Custo de manutenção crítico
            telMaintenance.textContent = activeSystems > 4 ? 'Crítico' : 'Alto';
            telMaintenanceSub.textContent = 'Difícil de Alterar';
            telMaintenanceSub.className = 'tel-sub text-rose';

            // Taxa de Sucesso baixa
            const succVal = (96.5 - activeSystems * 1.5).toFixed(1);
            telSuccess.textContent = `${succVal}%`;
            telSuccessSub.textContent = 'Falhas de Rede';
            telSuccessSub.className = 'tel-sub text-yellow';

            // Alerta Box
            alertBox.className = 'telemetry-alert warning-glow';
            alertBox.innerHTML = `
                <i data-lucide="alert-triangle" class="alert-icon"></i>
                <div class="alert-text">
                    <strong>Aviso de Arquitetura:</strong> A teia ponto a ponto exige ${connectionsCount} conexões! Mudar qualquer sistema exige atualizar todos os outros que se acoplam a ele.
                </div>
            `;
        } else {
            // Hub MuleSoft: 1 conexão por sistema
            const connectionsCount = activeSystems;
            telConnections.textContent = connectionsCount;
            telConnectionsSub.textContent = 'Mínimo Necessário';
            telConnectionsSub.className = 'tel-sub text-emerald';

            // Latência super baixa
            telLatency.textContent = '12ms';
            telLatencySub.textContent = 'Otimizado';
            telLatencySub.className = 'tel-sub text-emerald';

            // Manutenção
            telMaintenance.textContent = 'Mínimo';
            telMaintenanceSub.textContent = 'Fácil de Alterar';
            telMaintenanceSub.className = 'tel-sub text-emerald';

            // Taxa de Sucesso alta
            telSuccess.textContent = '99.99%';
            telSuccessSub.textContent = 'Estável e Confiável';
            telSuccessSub.className = 'tel-sub text-emerald';

            // Alerta Box
            alertBox.className = 'telemetry-alert success-glow';
            alertBox.innerHTML = `
                <i data-lucide="check-circle" class="alert-icon"></i>
                <div class="alert-text">
                    <strong>Arquitetura Hub-and-Spoke:</strong> Apenas ${connectionsCount} conexões! MuleSoft centraliza autenticação, tradução de dados (JSON/XML) e logs de forma automatizada.
                </div>
            `;
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    updateTelemetry();


    /* ==========================================================================
       9. SIMULADOR DE SCANNER DE TECNOLOGIA (TECHNOLOGY FINDER)
       ========================================================================== */
    const inputScan = document.getElementById('tech-finder-input');
    const btnScan = document.getElementById('btn-run-scan');
    const laserSweep = document.getElementById('laser-sweep-beam');

    // Mapeamento de cenários
    const scenarios = {
        ecommerce: ['shopify', 'stripe', 'sap', 'database'],
        crm: ['salesforce', 'database', 'slack'],
        erp: ['sap', 'database', 'stripe'],
        custom: ['salesforce', 'shopify', 'stripe', 'sap', 'database', 'slack']
    };

    function triggerScan(systemsToActivate) {
        if (isScanning) return;
        isScanning = true;
        
        // Toca som de início
        playScanSound();

        // Ativa animação do laser sweep
        laserSweep.classList.add('scanning-active');
        btnScan.disabled = true;
        btnScan.innerHTML = '<span>Escaneando...</span><i data-lucide="loader" class="btn-icon spin"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Desativa nós temporariamente para dar o efeito que estão sendo "descobertos"
        nodes.forEach(n => {
            if (!n.isHub) {
                n.active = false;
                n.element.classList.add('disconnected-state');
                n.element.classList.remove('connected');
            }
        });
        updateTelemetry();

        // Simula tempo de varredura
        setTimeout(() => {
            isScanning = false;
            laserSweep.classList.remove('scanning-active');
            btnScan.disabled = false;
            btnScan.innerHTML = '<span>Escanear</span><i data-lucide="cpu" class="btn-icon"></i>';
            
            // Ativa apenas os sistemas do cenário descoberto
            nodes.forEach(n => {
                if (n.isHub) return;
                
                if (systemsToActivate.includes(n.id)) {
                    n.active = true;
                    n.element.classList.remove('disconnected-state');
                    n.element.classList.add('connected');
                } else {
                    n.active = false;
                    n.element.classList.add('disconnected-state');
                    n.element.classList.remove('connected');
                }
            });
            
            // Toca som de sucesso
            playSuccessSound();
            updateTelemetry();
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 2200);
    }

    // Ouvir cliques nas Pills de Cenários presetados
    const pills = document.querySelectorAll('.pill-btn');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove seleção anterior
            pills.forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            
            const scenarioName = pill.getAttribute('data-scenario');
            
            // Preenche input com nome do cenário
            if (scenarioName === 'ecommerce') {
                inputScan.value = 'lojavirtual-integrada.com';
            } else if (scenarioName === 'crm') {
                inputScan.value = 'hubspot-salesforce-sync.org';
            } else if (scenarioName === 'erp') {
                inputScan.value = 'sap-financeiro.net';
            } else {
                inputScan.value = 'sistema-personalizado.io';
            }

            triggerScan(scenarios[scenarioName]);
        });
    });

    // Submissão do Input de Scan
    btnScan.addEventListener('click', () => {
        const text = inputScan.value.trim().toLowerCase();
        if (!text) {
            alert('Por favor, digite uma URL ou selecione um cenário de teste.');
            return;
        }

        // Mapeamento dinâmico baseado no input digitado
        let matchSystems = [];
        if (text.includes('shopify') || text.includes('loja') || text.includes('store') || text.includes('venda') || text.includes('mercado')) {
            matchSystems = scenarios.ecommerce;
            setPillActive('ecommerce');
        } else if (text.includes('crm') || text.includes('salesforce') || text.includes('lead') || text.includes('cliente') || text.includes('contato')) {
            matchSystems = scenarios.crm;
            setPillActive('crm');
        } else if (text.includes('sap') || text.includes('erp') || text.includes('financa') || text.includes('fiscal') || text.includes('banco')) {
            matchSystems = scenarios.erp;
            setPillActive('erp');
        } else {
            // Qualquer outra coisa ativa todos os nós (personalizado)
            matchSystems = scenarios.custom;
            setPillActive('custom');
        }

        triggerScan(matchSystems);
    });

    function setPillActive(scenarioId) {
        pills.forEach(p => {
            if (p.getAttribute('data-scenario') === scenarioId) {
                p.classList.add('selected');
            } else {
                p.classList.remove('selected');
            }
        });
    }

    // Gatilho inicial
    triggerScan(scenarios.custom);


    /* ==========================================================================
       10. DETALHE DOS NÓS (MODAL INFORMATIVO)
       ========================================================================== */
    const modal = document.getElementById('node-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalStatus = document.getElementById('modal-status');
    const modalProtocol = document.getElementById('modal-protocol');
    const modalConnections = document.getElementById('modal-active-connections');
    const modalImpact = document.getElementById('modal-impact');
    const modalIconBg = document.getElementById('modal-icon-bg');
    const modalIcon = document.getElementById('modal-icon');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnTestConn = document.getElementById('btn-modal-test-conn');
    const btnDisconnect = document.getElementById('btn-modal-disconnect');
    const btnDisconnectText = document.getElementById('btn-disconnect-text');

    let activeNodeDetails = null;

    // Ficha técnica de cada sistema para o Modal
    const systemDatabase = {
        mulesoft: {
            title: 'MuleSoft Anypoint Platform',
            desc: 'O motor centralizador de APIs e integrações da empresa. Ele traduz dados, gerencia segurança, políticas de tráfego, limites de requisição e orquestra fluxos complexos em tempo real.',
            protocol: 'RAML / OAS / REST & SOAP',
            impact: 'Nível 5 - Desastre total se offline',
            icon: 'blocks'
        },
        salesforce: {
            title: 'Salesforce CRM',
            desc: 'Plataforma líder para gestão de relacionamento com clientes. Armazena dados cadastrais, histórico de interações e pipeline de leads de vendas.',
            protocol: 'REST / SOAP / Bulk API (JSON & XML)',
            impact: 'Alto - Vendedores ficam sem sistema',
            icon: 'users'
        },
        shopify: {
            title: 'Shopify Storefront',
            desc: 'Portal de e-commerce voltado para o consumidor final. Processa vitrine de produtos, cadastros de carrinhos e compras finalizadas.',
            protocol: 'GraphQL & REST Webhooks (JSON)',
            impact: 'Crítico - Vendas online param totalmente',
            icon: 'shopping-cart'
        },
        stripe: {
            title: 'Stripe Payments',
            desc: 'Gateway internacional para cobranças com cartões de crédito, Pix e boleto. Garante conformidade de segurança financeira PCI-DSS.',
            protocol: 'REST API HTTPS (JSON)',
            impact: 'Crítico - Impossível processar faturamento',
            icon: 'credit-card'
        },
        sap: {
            title: 'SAP ERP Legado',
            desc: 'Sistema central de planejamento de recursos da empresa. Responsável por faturamento oficial, contabilidade complexa, estoque fiscal e contabilidade integrada.',
            protocol: 'RFC / SOAP (XML pesado)',
            impact: 'Médio-Alto - Atraso na emissão de Notas Fiscais',
            icon: 'building'
        },
        database: {
            title: 'Banco de Dados PostgreSQL',
            desc: 'Instância relacional de estoque e catálogo corporativo. Controla em tempo real a quantidade exata de cada produto físico disponível no galpão.',
            protocol: 'TCP/IP (Driver JDBC / SQL nativo)',
            impact: 'Alto - Risco de vender itens esgotados',
            icon: 'database'
        },
        slack: {
            title: 'Slack Corporate API',
            desc: 'Ferramenta de colaboração interna. Utilizada pelo time de logística e suporte para receber alertas automáticos de novos pedidos grandes ou falhas críticas.',
            protocol: 'Incoming Webhooks (JSON)',
            impact: 'Baixo - Notificações ficam atrasadas',
            icon: 'slack'
        }
    };

    // Abre modal no clique do nó
    nodes.forEach(node => {
        if (!node.element) return;
        
        node.element.addEventListener('click', (e) => {
            // Evita abrir modal se for o final de um evento de arrastar longo
            if (draggedNode) return;
            
            openDetailsModal(node);
        });
    });

    function openDetailsModal(node) {
        activeNodeDetails = node;
        const details = systemDatabase[node.id];
        
        if (!details) return;

        // Toca som de clique
        playBeep(600, 0.1, 'sine', 0.05);

        modalTitle.textContent = details.title;
        modalDesc.textContent = details.desc;
        modalProtocol.textContent = details.protocol;
        modalImpact.textContent = details.impact;

        // Configura ícone
        modalIcon.setAttribute('data-lucide', details.icon);
        
        // Status do nó
        if (node.isHub) {
            modalStatus.className = 'badge badge-indigo';
            modalStatus.textContent = 'Orquestrador Principal';
            btnDisconnect.style.display = 'none';
        } else {
            btnDisconnect.style.display = 'inline-flex';
            if (node.active) {
                modalStatus.className = 'badge badge-emerald';
                modalStatus.textContent = 'Ativo e Conectado';
                btnDisconnectText.textContent = currentMode === 'hub' ? 'Desconectar do Hub' : 'Desconectar do Fluxo';
                btnDisconnect.className = 'btn btn-rose';
            } else {
                modalStatus.className = 'badge badge-rose';
                modalStatus.textContent = 'Offline / Inativo';
                btnDisconnectText.textContent = 'Ativar Sistema';
                btnDisconnect.className = 'btn btn-primary';
            }
        }

        // Conexões ativas exibidas no modal
        if (node.isHub) {
            const activeCount = nodes.filter(n => !n.isHub && n.active).length;
            modalConnections.textContent = activeCount;
        } else {
            if (!node.active) {
                modalConnections.textContent = '0';
            } else {
                modalConnections.textContent = currentMode === 'hub' ? '1' : (nodes.filter(n => n.active).length - 1);
            }
        }

        modal.classList.add('open');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Fechar modal
    btnCloseModal.addEventListener('click', () => {
        modal.classList.remove('open');
        playBeep(300, 0.05, 'sine', 0.05);
    });

    // Fecha modal clicando fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            playBeep(300, 0.05, 'sine', 0.05);
        }
    });

    // Testar conexão simulada
    btnTestConn.addEventListener('click', () => {
        if (!activeNodeDetails) return;
        
        btnTestConn.disabled = true;
        btnTestConn.innerHTML = '<i data-lucide="loader" class="btn-icon spin"></i> Ping...';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        playBeep(700, 0.1, 'sine', 0.05);

        setTimeout(() => {
            btnTestConn.disabled = false;
            btnTestConn.innerHTML = '<i data-lucide="refresh-cw" class="btn-icon"></i> <span>Testar Conexão</span>';
            
            if (activeNodeDetails.isHub) {
                alert('MuleSoft Hub operando em 100% da capacidade. Threads disponíveis: 16/16.');
            } else if (activeNodeDetails.active) {
                playSuccessSound();
                alert(`Ping bem-sucedido para ${activeNodeDetails.name}! Latência do gateway: ${currentMode === 'hub' ? '12ms' : '350ms'}. Código de retorno: HTTP 200 OK.`);
            } else {
                playDisconnectSound();
                alert(`Erro de conexão! O sistema ${activeNodeDetails.name} está inativo no painel principal ou inacessível devido à quebra de rota.`);
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 1200);
    });

    // Desconectar ou Reconectar o sistema do fluxo no Modal
    btnDisconnect.addEventListener('click', () => {
        if (!activeNodeDetails || activeNodeDetails.isHub) return;

        const isCurrentlyActive = activeNodeDetails.active;
        activeNodeDetails.active = !isCurrentlyActive;

        if (isCurrentlyActive) {
            // Desativou
            activeNodeDetails.element.classList.add('disconnected-state');
            activeNodeDetails.element.classList.remove('connected');
            playDisconnectSound();
        } else {
            // Ativou
            activeNodeDetails.element.classList.remove('disconnected-state');
            activeNodeDetails.element.classList.add('connected');
            playSuccessSound();
        }

        modal.classList.remove('open');
        updateTelemetry();
    });

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
        
        // Fechar ao clicar em um link interno (para âncoras/módulos)
        sidebar.querySelectorAll('.nav-item, .nav-subitem').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
            });
        });
    }

});
