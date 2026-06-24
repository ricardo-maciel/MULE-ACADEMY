(function () {
    const canvas = document.getElementById('tech-network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const spotlight = document.querySelector('.tech-spotlight');
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false, lastMove: 0 };

    let currentMode = localStorage.getItem('muleacademy_perf_mode') || 'normal';
    let animationId = null;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let packets = [];
    let ripples = [];
    let trails = [];
    let frame = 0;

    const palette = [
        [52, 213, 255],
        [99, 102, 241],
        [139, 92, 246],
        [20, 184, 166]
    ];

    const random = (min, max) => Math.random() * (max - min) + min;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function createParticle(layer) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        const speed = layer === 0 ? 0.1 : layer === 1 ? 0.2 : 0.32;

        return {
            x: random(0, width),
            y: random(0, height),
            vx: random(-speed, speed),
            vy: random(-speed, speed),
            radius: random(1, layer === 2 ? 2.35 : 1.85),
            layer,
            color,
            phase: random(0, Math.PI * 2),
            pulse: random(0.6, 1.25)
        };
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const smallScreen = width < 720;
        const area = width * height;
        let total = clamp(
            Math.floor(area / (smallScreen ? 15800 : 10800)),
            smallScreen ? 42 : 74,
            smallScreen ? 74 : 132
        );

        if (currentMode === 'media') {
            total = Math.floor(total * 0.5);
        } else if (currentMode === 'maxima') {
            total = 0;
        }

        particles = [];
        for (let i = 0; i < total; i += 1) {
            const layer = i < total * 0.34 ? 0 : i < total * 0.72 ? 1 : 2;
            particles.push(createParticle(layer));
        }

        pointer.x = pointer.tx = width * 0.62;
        pointer.y = pointer.ty = height * 0.42;
    }

    function updatePointer(clientX, clientY, active = true) {
        pointer.tx = clientX;
        pointer.ty = clientY;
        pointer.active = active;
        pointer.lastMove = performance.now();

        if (spotlight) {
            spotlight.style.setProperty('--tech-mx', `${clientX}px`);
            spotlight.style.setProperty('--tech-my', `${clientY}px`);
        }

        trails.push({
            x: clientX,
            y: clientY,
            life: 1,
            hue: Math.random() > 0.5 ? '52, 213, 255' : '20, 184, 166'
        });

        if (trails.length > 34) trails.shift();
    }

    function addRipple(clientX, clientY) {
        ripples.push({ x: clientX, y: clientY, radius: 0, life: 1 });

        for (let i = 0; i < 12; i += 1) {
            packets.push({
                x: clientX,
                y: clientY,
                vx: Math.cos((Math.PI * 2 * i) / 12) * random(1.4, 3.3),
                vy: Math.sin((Math.PI * 2 * i) / 12) * random(1.4, 3.3),
                life: 1,
                color: palette[i % palette.length]
            });
        }
    }

    function drawGrid(time) {
        const grid = 68;
        const parallaxX = (pointer.x - width / 2) * 0.018;
        const parallaxY = (pointer.y - height / 2) * 0.018;

        ctx.save();
        ctx.globalAlpha = 0.13;
        ctx.strokeStyle = 'rgba(88, 172, 255, 0.34)';
        ctx.lineWidth = 1;

        for (let x = ((time * 0.012 + parallaxX) % grid) - grid; x < width + grid; x += grid) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + parallaxX * 2, height);
            ctx.stroke();
        }

        for (let y = ((time * 0.008 + parallaxY) % grid) - grid; y < height + grid; y += grid) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y + parallaxY * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    function updateParticles(time) {
        pointer.x += (pointer.tx - pointer.x) * 0.12;
        pointer.y += (pointer.ty - pointer.y) * 0.12;

        if (performance.now() - pointer.lastMove > 2200) pointer.active = false;

        particles.forEach((particle) => {
            const depth = 0.45 + particle.layer * 0.32;
            const parallaxX = (pointer.x - width / 2) * depth * 0.018;
            const parallaxY = (pointer.y - height / 2) * depth * 0.018;
            const floatX = Math.cos(time * 0.0012 + particle.phase) * particle.pulse;
            const floatY = Math.sin(time * 0.001 + particle.phase) * particle.pulse;

            particle.x += particle.vx + floatX * 0.025 + parallaxX * 0.004;
            particle.y += particle.vy + floatY * 0.025 + parallaxY * 0.004;

            if (particle.x < -20) particle.x = width + 20;
            if (particle.x > width + 20) particle.x = -20;
            if (particle.y < -20) particle.y = height + 20;
            if (particle.y > height + 20) particle.y = -20;

            const dx = pointer.x - particle.x;
            const dy = pointer.y - particle.y;
            const dist = Math.hypot(dx, dy);
            const radius = pointer.active ? 185 : 118;

            if (dist < radius) {
                const strength = (1 - dist / radius) * (particle.layer === 2 ? 1.65 : 1.08);
                const direction = pointer.active ? 1 : -0.28;
                particle.x += (dx / Math.max(dist, 1)) * strength * direction;
                particle.y += (dy / Math.max(dist, 1)) * strength * direction;
            }
        });
    }

    function drawConnections() {
        const maxDistance = width < 720 ? 104 : 142;

        for (let i = 0; i < particles.length; i += 1) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j += 1) {
                const b = particles[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d > maxDistance) continue;

                const opacity = (1 - d / maxDistance) * (0.32 + (a.layer + b.layer) * 0.08);
                if (currentMode === 'normal') {
                    const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                    gradient.addColorStop(0, `rgba(${a.color.join(',')}, ${opacity})`);
                    gradient.addColorStop(1, `rgba(${b.color.join(',')}, ${opacity * 0.62})`);
                    ctx.strokeStyle = gradient;
                } else {
                    ctx.strokeStyle = `rgba(${a.color.join(',')}, ${opacity * 0.7})`;
                }
                ctx.lineWidth = 0.5 + Math.max(a.layer, b.layer) * 0.22;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();

                if (d < maxDistance * 0.72 && frame % 7 === 0 && packets.length < 72 && Math.random() < 0.012) {
                    packets.push({
                        x: a.x,
                        y: a.y,
                        tx: b.x,
                        ty: b.y,
                        progress: 0,
                        speed: random(0.006, 0.018),
                        life: 1,
                        color: a.color
                    });
                }
            }
        }
    }

    function drawParticles(time) {
        particles.forEach((particle) => {
            const glow = 0.55 + Math.sin(time * 0.003 + particle.phase) * 0.35;

            ctx.save();
            if (currentMode === 'normal') {
                ctx.shadowColor = `rgba(${particle.color.join(',')}, ${0.5 + particle.layer * 0.12})`;
                ctx.shadowBlur = 14 + particle.layer * 7;
            }
            ctx.fillStyle = `rgba(${particle.color.join(',')}, ${0.48 + glow * 0.35})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius + particle.layer * 0.22, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    function drawPackets() {
        packets = packets.filter((packet) => packet.life > 0);

        packets.forEach((packet) => {
            if (typeof packet.progress === 'number') {
                packet.progress += packet.speed;
                packet.life = 1 - packet.progress;
                packet.x += (packet.tx - packet.x) * packet.speed * 2.2;
                packet.y += (packet.ty - packet.y) * packet.speed * 2.2;
            } else {
                packet.x += packet.vx;
                packet.y += packet.vy;
                packet.vx *= 0.982;
                packet.vy *= 0.982;
                packet.life -= 0.017;
            }

            ctx.save();
            if (currentMode === 'normal') {
                ctx.shadowColor = `rgba(${packet.color.join(',')}, 0.84)`;
                ctx.shadowBlur = 16;
            }
            ctx.fillStyle = `rgba(${packet.color.join(',')}, ${Math.max(packet.life, 0)})`;
            ctx.beginPath();
            ctx.arc(packet.x, packet.y, 2.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    function drawTrails() {
        trails = trails.filter((trail) => trail.life > 0.02);

        trails.forEach((trail) => {
            trail.life *= 0.88;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `rgba(${trail.hue}, ${trail.life * 0.18})`;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, 22 * (1 - trail.life) + 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    function drawRipples() {
        ripples = ripples.filter((ripple) => ripple.life > 0.02);

        ripples.forEach((ripple) => {
            ripple.radius += 5.8;
            ripple.life *= 0.94;
            ctx.save();
            ctx.strokeStyle = `rgba(52, 213, 255, ${ripple.life * 0.46})`;
            ctx.lineWidth = 1.5;
            if (currentMode === 'normal') {
                ctx.shadowColor = 'rgba(52, 213, 255, 0.72)';
                ctx.shadowBlur = 18;
            }
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        });
    }

    function animate(time = 0) {
        if (currentMode === 'maxima') {
            ctx.clearRect(0, 0, width, height);
            animationId = null;
            return;
        }
        frame += 1;
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
        drawGrid(time);
        updateParticles(time);
        ctx.globalCompositeOperation = 'lighter';
        drawConnections();
        drawTrails();
        drawRipples();
        drawParticles(time);
        drawPackets();
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (event) => updatePointer(event.clientX, event.clientY));
    window.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        if (touch) updatePointer(touch.clientX, touch.clientY);
    }, { passive: true });
    window.addEventListener('mouseleave', () => {
        pointer.active = false;
    });
    window.addEventListener('click', (event) => {
        updatePointer(event.clientX, event.clientY);
        addRipple(event.clientX, event.clientY);
    });

    window.setPerformanceMode = function (mode) {
        if (mode !== 'normal' && mode !== 'media' && mode !== 'maxima') return;
        currentMode = mode;
        localStorage.setItem('muleacademy_perf_mode', mode);

        document.body.classList.remove('perf-normal', 'perf-media', 'perf-maxima');
        document.body.classList.add(`perf-${mode}`);

        resize();

        if (currentMode !== 'maxima' && !animationId) {
            animationId = requestAnimationFrame(animate);
        }
    };

    updatePointer(width * 0.62, height * 0.42, false);
    window.setPerformanceMode(currentMode);
}());
