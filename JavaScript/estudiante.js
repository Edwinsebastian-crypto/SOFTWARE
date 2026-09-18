// Lógica específica para la vista de Estudiante
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

    // Botones de acción de la bitácora identificados por contexto
    const bitacoraActionBtns = bitacoraPanel
        ? bitacoraPanel.querySelectorAll('.b-action-btn')
        : [];
    const actividadesEntrarBitacora = bitacoraActionBtns[0] || null;
    const preguntasBtn             = bitacoraActionBtns[1] || null;

    // Botones de acción del panel de preguntas
    const preguntasActionBtns = preguntasPanel
        ? preguntasPanel.querySelectorAll('.b-action-btn')
        : [];
    const preguntasEntrarActividades = preguntasActionBtns[0] || null;
    const preguntasEntrarPreguntas   = preguntasActionBtns[1] || null;

    function resetScroll() {
        window.scrollTo(0, 0);
        const wrapper = document.querySelector('.practice-content-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
        const appShell = document.querySelector('.app-shell');
        if (appShell) appShell.scrollTop = 0;
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
    if (preguntasEntrarActividades && preguntasPanel && actividadesPanel) {
        preguntasEntrarActividades.addEventListener('click', () => {
            preguntasPanel.style.display = 'none';
            actividadesPanel.style.display = 'flex';
            resetScroll();
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
        actividadesBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const numActividad = btn.getAttribute('data-actividad');
                // Actualiza el título para mostrar a qué actividad pertenecen las evidencias
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

    // ── Abrir modal/área de "Editar evidencia" ───────────────────────────
    document.querySelectorAll('.ev-item--editar').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Abrir evidencia (editar)');
        });
    });

    // ── Abrir modal de confirmación para "Eliminar evidencia" ─────────────
    document.querySelectorAll('.ev-item--eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            const evidenciaTitle = btn.closest('.ev-card').querySelector('.ev-card-title').textContent;
            console.log('Eliminar evidencia:', evidenciaTitle);
            // Aquí puedes mostrar un modal de confirmación antes de eliminar
        });
    });
});