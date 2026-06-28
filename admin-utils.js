// ==========================================================================
// UTILITÁRIO DE ADMIN — Exibe botão de retorno ao painel administrativo
// para usuários com email admin@curso.com em qualquer página da plataforma
// ==========================================================================
(function () {
    let user = null;
    try {
        user = JSON.parse(sessionStorage.getItem('muleacademy_current_user'));
    } catch (e) {}

    if (user && user.email === 'admin@curso.com') {
        // Mostrar todos os botões admin (sidebar e header)
        document.querySelectorAll('.admin-only-btn, #btn-back-to-admin').forEach(el => {
            el.classList.remove('hidden');
            el.style.display = 'flex';
        });

        // Re-inicializar ícones do Lucide para o novo botão
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } else {
        // Garantir que fica oculto para qualquer outro usuário
        document.querySelectorAll('.admin-only-btn, #btn-back-to-admin').forEach(el => {
            el.style.display = 'none';
        });
    }
})();
