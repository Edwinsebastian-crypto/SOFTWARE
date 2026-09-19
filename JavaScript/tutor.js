// Lógica específica para la vista de Tutor
document.addEventListener('DOMContentLoaded', () => {
    const btnEntrar = document.querySelector('.practice-submit');
    const practicePanel = document.querySelector('.practice-panel');
    const bitacoraPanel = document.getElementById('bitacora-panel');
    const bitacoraBackBtn = document.getElementById('bitacoraBack');

    const actividadesPanel = document.getElementById('actividades-panel');
    const actividadesBackBtn = document.getElementById('actividadesBack');
    // querySelectorAll captura los 6 botones "Entrar" (uno por actividad)
    const actividadesBtns = document.querySelectorAll('.actividad-entrar-btn');

    const preguntasPanel = document.getElementById('preguntas-panel');
    const preguntasBackBtn = document.getElementById('preguntasBack');

    const evidenciasPanel = document.getElementById('evidencias-panel');
    const evidenciasBackBtn = document.getElementById('evidenciasBack');
    const evidenciasTitleEl = document.getElementById('evidencias-title');

    // Botones de acción de la bitácora identificados por contexto (no por ID duplicado)
    // El bitacora-panel tiene exactamente dos .b-action-btn: Actividades y Preguntas
    const bitacoraActionBtns = bitacoraPanel
        ? bitacoraPanel.querySelectorAll('.b-action-btn')
        : [];
    const actividadesEntrarBitacora = bitacoraActionBtns[0] || null; // primer btn = Actividades
    const preguntasBtn = bitacoraActionBtns[1] || null; // segundo btn = Preguntas

    // Botones de acción del panel de preguntas
    const preguntasActionBtns = preguntasPanel
        ? preguntasPanel.querySelectorAll('.b-action-btn')
        : [];
    const preguntasEntrarActividades = preguntasActionBtns[0] || null;
    const preguntasEntrarPreguntas = preguntasActionBtns[1] || null;

    function resetScroll() {
        window.scrollTo(0, 0);
        // En móvil el scroll está en .app-shell
        const appShell = document.querySelector('.app-shell');
        if (appShell) appShell.scrollTop = 0;
        const wrapper = document.querySelector('.practice-content-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
    }

    // ── Entrar a Bitácora desde Práctica ──────────────────────────────────
    if (btnEntrar && practicePanel && bitacoraPanel) {
        btnEntrar.addEventListener('click', () => {
            practicePanel.style.display = 'none';
            bitacoraPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // ── Volver a Práctica desde Bitácora ──────────────────────────────────
    if (bitacoraBackBtn && practicePanel && bitacoraPanel) {
        bitacoraBackBtn.addEventListener('click', () => {
            bitacoraPanel.style.display = 'none';
            practicePanel.style.display = 'block';
            resetScroll();
        });
    }

    // ── Entrar a Actividades desde Bitácora o Preguntas ───────────────────────────────
    if (actividadesEntrarBitacora && bitacoraPanel && actividadesPanel) {
        actividadesEntrarBitacora.addEventListener('click', () => {
            bitacoraPanel.style.display = 'none';
            actividadesPanel.style.display = 'flex';
            resetScroll();
        });
    }
    if (preguntasEntrarActividades) {
        preguntasEntrarActividades.addEventListener('click', () => {
            alert('Sección en construcción');
        });
    }
    if (preguntasEntrarPreguntas) {
        preguntasEntrarPreguntas.addEventListener('click', () => {
            alert('Sección en construcción');
        });
    }

    // ── Volver a Bitácora desde Actividades ───────────────────────────────
    if (actividadesBackBtn && bitacoraPanel && actividadesPanel) {
        actividadesBackBtn.addEventListener('click', () => {
            actividadesPanel.style.display = 'none';
            bitacoraPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // ── Entrar a Evidencias desde cualquier botón de Actividad (#1 al #6) ─
    if (actividadesBtns.length > 0 && actividadesPanel && evidenciasPanel) {
        actividadesBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                // Intentamos sacar el número, si no existe usamos el índice + 1
                const numActividad = btn.getAttribute('data-actividad') || (index + 1);

                if (evidenciasTitleEl) {
                    evidenciasTitleEl.textContent = `Evidencias — Actividad #${numActividad}`;
                }
                actividadesPanel.style.display = 'none';
                evidenciasPanel.style.display = 'flex';
                resetScroll();
            });
        });
    }

    // ── Volver a Actividades desde Evidencias ─────────────────────────────
    if (evidenciasBackBtn && actividadesPanel && evidenciasPanel) {
        evidenciasBackBtn.addEventListener('click', () => {
            evidenciasPanel.style.display = 'none';
            actividadesPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // ── Entrar a Preguntas desde Bitácora ─────────────────────────────────
    if (preguntasBtn && bitacoraPanel && preguntasPanel) {
        preguntasBtn.addEventListener('click', () => {
            bitacoraPanel.style.display = 'none';
            preguntasPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // ── Volver a Bitácora desde Preguntas ─────────────────────────────────
    if (preguntasBackBtn && bitacoraPanel && preguntasPanel) {
        preguntasBackBtn.addEventListener('click', () => {
            preguntasPanel.style.display = 'none';
            bitacoraPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // ── Menú de tres puntos en tarjetas de Evidencias ─────────────────────
    function closeAllEvDropdowns(exceptBtn) {
        document.querySelectorAll('.ev-menu-btn').forEach(btn => {
            if (btn === exceptBtn) return;
            btn.setAttribute('aria-expanded', 'false');
            const dd = btn.nextElementSibling;
            if (dd) dd.classList.remove('is-open');
        });
    }

    document.querySelectorAll('.ev-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            closeAllEvDropdowns(btn);
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                const dd = btn.nextElementSibling;
                if (dd) dd.classList.add('is-open');
            } else {
                btn.setAttribute('aria-expanded', 'false');
                const dd = btn.nextElementSibling;
                if (dd) dd.classList.remove('is-open');
            }
        });
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', () => closeAllEvDropdowns(null));

    // ── Abrir modal de "Ver evidencia" ──────────────────────────────────
    document.querySelectorAll('.ev-item--ver').forEach(btn => {
        btn.addEventListener('click', () => {
            // Opcional: aquí puedes abrir un modal con un <iframe> o la imagen
            console.log('Abrir evidencia (ver)');
        });
    });

    // ── Enviar / Cancelar Retroalimentación ─────────────────────────────
    const retroBtnSubmit = document.querySelector('.retro-btn-submit');
    const retroBtnCancel = document.querySelector('.retro-btn-cancel');
    const retroTextarea = document.querySelector('.retro-textarea');
    const scrollContainer = document.querySelector('.practice-content-wrapper');

    // Auto-crecer textarea y mantener el botón cancelar visible
    if (retroTextarea) {
        retroTextarea.addEventListener('input', () => {
            retroTextarea.style.height = 'auto';
            retroTextarea.style.height = Math.min(retroTextarea.scrollHeight, 200) + 'px';
            // Hacer scroll suave para que el botón cancelar siempre sea visible
            if (retroBtnCancel) {
                requestAnimationFrame(() => {
                    retroBtnCancel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                });
            }
        });
    }

    if (retroBtnSubmit && retroTextarea) {
        retroBtnSubmit.addEventListener('click', () => {
            const text = retroTextarea.value.trim();
            if (text) {
                console.log('Enviando retroalimentación:', text);
                retroTextarea.value = '';
                retroTextarea.style.height = 'auto';
                alert('Retroalimentación enviada con éxito');
            } else {
                alert('Por favor ingrese un comentario antes de enviar.');
            }
        });
    }

    if (retroBtnCancel && retroTextarea) {
        retroBtnCancel.addEventListener('click', () => {
            retroTextarea.value = '';
            retroTextarea.style.height = 'auto';
            console.log('Edición de retroalimentación cancelada');
        });
    }
});