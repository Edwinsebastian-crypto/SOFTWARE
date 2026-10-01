// Logica especifica para la vista de Estudiante
document.addEventListener('DOMContentLoaded', () => {
    const btnEntrar = document.querySelector('.practice-submit');
    const practicePanel = document.querySelector('.practice-panel');
    const practicaPanel = document.getElementById('practica-panel');
    const practicaBackBtn = document.getElementById('practicaBack');

    const actividadesPanel = document.getElementById('actividades-panel');
    const actividadesBackBtn = document.getElementById('actividadesBack');
    const actividadesBtns = document.querySelectorAll('.actividad-entrar-btn');

    const evidenciasPanel = document.getElementById('evidencias-panel');
    const evidenciasBackBtn = document.getElementById('evidenciasBack');
    const evidenciasTitleEl = document.getElementById('evidencias-title');

    const practicaActionBtns = practicaPanel
        ? practicaPanel.querySelectorAll('.b-action-btn')
        : [];
    const actividadesEntrarpractica = practicaActionBtns[0] || null;

    function resetScroll() {
        window.scrollTo(0, 0);
        const appShell = document.querySelector('.app-shell');
        if (appShell) appShell.scrollTop = 0;
        const wrapper = document.querySelector('.practice-content-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
    }

    // Entrar a Bitacora desde Practica
    if (btnEntrar && practicePanel && practicaPanel) {
        btnEntrar.addEventListener('click', () => {
            practicePanel.style.display = 'none';
            practicaPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // Volver a Practica desde Bitacora
    if (practicaBackBtn && practicePanel && practicaPanel) {
        practicaBackBtn.addEventListener('click', () => {
            practicaPanel.style.display = 'none';
            practicePanel.style.display = 'block';
            resetScroll();
        });
    }

    // Entrar a Actividades desde Bitacora
    if (actividadesEntrarpractica && practicaPanel && actividadesPanel) {
        actividadesEntrarpractica.addEventListener('click', () => {
            practicaPanel.style.display = 'none';
            actividadesPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // Volver a Bitacora desde Actividades
    if (actividadesBackBtn && practicaPanel && actividadesPanel) {
        actividadesBackBtn.addEventListener('click', () => {
            actividadesPanel.style.display = 'none';
            practicaPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // Entrar a Evidencias desde Actividades
    actividadesBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const num = btn.getAttribute('data-actividad');
            if (evidenciasTitleEl) {
                evidenciasTitleEl.textContent = 'Actividad #' + num;
            }
            if (actividadesPanel) actividadesPanel.style.display = 'none';
            if (evidenciasPanel) evidenciasPanel.style.display = 'flex';
            resetScroll();
        });
    });

    // Volver a Actividades desde Evidencias
    if (evidenciasBackBtn && actividadesPanel && evidenciasPanel) {
        evidenciasBackBtn.addEventListener('click', () => {
            evidenciasPanel.style.display = 'none';
            actividadesPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // Lógica de menús de evidencias fue movida al final del archivo

    // Abrir modal de "Ver evidencia"
    document.querySelectorAll('.ev-item--ver').forEach((btn) => {
        btn.addEventListener('click', () => {
            console.log('Ver evidencia');
        });
    });

    // Abrir modal de "Eliminar evidencia"
    document.querySelectorAll('.ev-item--eliminar').forEach((btn) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.ev-card');
            const title = card ? card.querySelector('.ev-card-title') : null;
            console.log('Eliminar evidencia:', title ? title.textContent : '');
        });
    });
});

/* ==========================================================================
   Modal "Asignar Nueva Actividad" - Estudiante
   Logica completa con drag & drop, chips de archivos, validacion y
   creacion dinamica de tarjeta de actividad (igual que tutor.js).
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const openBtns  = document.querySelectorAll('.am-open-btn, #amOpenBtn');
    const modal     = document.getElementById('am-modal');
    if (openBtns.length === 0 || !modal) return;

    const closeX        = document.getElementById('amModalCloseX');
    const btnCancel     = document.getElementById('amBtnCancel');
    const form          = document.getElementById('am-form');
    const dropzone      = document.getElementById('am-dropzone');
    const fileInput     = document.getElementById('am-file-input');
    const fileListEl    = document.getElementById('am-file-list');
    const nombreInput   = document.getElementById('am-nombre');

    const actividadesPanel  = document.getElementById('actividades-panel');
    const evidenciasPanel   = document.getElementById('evidencias-panel');
    const evidenciasTitleEl = document.getElementById('evidencias-title');

    let archivosSeleccionados = [];
    let ultimoFoco = null;

    function resetScroll() {
        window.scrollTo(0, 0);
        const shell = document.querySelector('.app-shell');
        if (shell) shell.scrollTop = 0;
        const wrapper = document.querySelector('.practice-content-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
    }

    function escapeHtml(t) {
        const d = document.createElement('div');
        d.textContent = t == null ? '' : String(t);
        return d.innerHTML;
    }

    // Abrir y cerrar modal
    function abrirModal() {
        ultimoFoco = document.activeElement;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (nombreInput) setTimeout(() => nombreInput.focus(), 50);
    }
    function cerrarModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        if (form) form.reset();
        archivosSeleccionados = [];
        pintarArchivos();
        if (ultimoFoco && typeof ultimoFoco.focus === 'function') ultimoFoco.focus();
    }

    openBtns.forEach(btn => btn.addEventListener('click', abrirModal));
    if (closeX)    closeX.addEventListener('click', cerrarModal);
    if (btnCancel) btnCancel.addEventListener('click', cerrarModal);
    // modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); }); // Desactivado por petición del usuario
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') cerrarModal();
    });

    // Drag & Drop y selector de archivos
    function agregarArchivos(list) {
        Array.from(list || []).forEach((f) => archivosSeleccionados.push(f));
        pintarArchivos();
    }
    function quitarArchivo(idx) {
        archivosSeleccionados.splice(idx, 1);
        pintarArchivos();
    }
    function pintarArchivos() {
        if (!fileListEl) return;
        if (archivosSeleccionados.length === 0) {
            fileListEl.innerHTML = '';
            fileListEl.classList.remove('has-files');
            return;
        }
        fileListEl.classList.add('has-files');
        fileListEl.innerHTML = archivosSeleccionados.map((f, i) =>
            '<span class="am-file-chip">' +
            '<i class="fa-solid fa-paperclip" aria-hidden="true"></i>' +
            '<span class="am-file-chip-name">' + escapeHtml(f.name) + '</span>' +
            '<button type="button" class="am-file-remove" data-idx="' + i + '" aria-label="Quitar ' + escapeHtml(f.name) + '">' +
            '<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
            '</span>'
        ).join('');
        fileListEl.querySelectorAll('.am-file-remove').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                quitarArchivo(parseInt(btn.getAttribute('data-idx'), 10));
            });
        });
    }

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
        });
        ['dragenter', 'dragover'].forEach((ev) => {
            dropzone.addEventListener(ev, (e) => {
                e.preventDefault(); e.stopPropagation();
                dropzone.classList.add('is-dragover');
            });
        });
        ['dragleave', 'drop'].forEach((ev) => {
            dropzone.addEventListener(ev, (e) => {
                e.preventDefault(); e.stopPropagation();
                dropzone.classList.remove('is-dragover');
            });
        });
        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer && e.dataTransfer.files) agregarArchivos(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', () => {
            agregarArchivos(fileInput.files);
            fileInput.value = '';
        });
    }

    // Crear tarjeta de actividad al confirmar
    function siguienteNumero() {
        const btns = actividadesPanel
            ? actividadesPanel.querySelectorAll('.actividad-entrar-btn')
            : [];
        let max = 0;
        btns.forEach((b) => {
            const n = parseInt(b.getAttribute('data-actividad'), 10);
            if (!isNaN(n)) max = Math.max(max, n);
        });
        return max + 1;
    }
    function crearTarjeta(numero, nombre) {
        const card = document.createElement('div');
        card.className = 'practica-action-card';
        card.innerHTML =
            '<div class="b-action-left">' +
            '<div class="stat-icon"><i class="fa-solid fa-file-lines" aria-hidden="true"></i></div>' +
            '<span class="b-action-label">Actividad #' + numero +
            (nombre ? ' - ' + escapeHtml(nombre) : '') + '</span>' +
            '</div>' +
            '<button type="button" class="b-action-btn actividad-entrar-btn" data-actividad="' +
            numero + '">Entrar</button>';
        return card;
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = (nombreInput ? nombreInput.value : '').trim();
            if (!nombre) {
                if (nombreInput) {
                    nombreInput.focus();
                    nombreInput.classList.add('am-input-error');
                    setTimeout(() => nombreInput.classList.remove('am-input-error'), 1200);
                }
                return;
            }
            const numero = siguienteNumero();
            const nuevaTarjeta = crearTarjeta(numero, nombre);
            if (actividadesPanel) actividadesPanel.appendChild(nuevaTarjeta);

            const btnEntrar = nuevaTarjeta.querySelector('.actividad-entrar-btn');
            if (btnEntrar && actividadesPanel && evidenciasPanel) {
                btnEntrar.addEventListener('click', () => {
                    if (evidenciasTitleEl) {
                        evidenciasTitleEl.textContent = 'Actividad #' + numero;
                    }
                    actividadesPanel.style.display = 'none';
                    evidenciasPanel.style.display = 'flex';
                    resetScroll();
                });
            }
            cerrarModal();
        });
    }

    // ── Lógica para botones de opciones (Ver/Editar/Eliminar) en Evidencias ──
    function setEvMenuState(btn, open) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        
        const dd = btn.nextElementSibling;
        if (dd && dd.classList.contains('ev-dropdown')) {
            dd.classList.toggle('is-open', open);
        }

        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-ellipsis', !open);
            icon.classList.toggle('fa-arrow-left', open);
        }
    }

    function closeAllEvDropdowns(exceptBtn = null) {
        document.querySelectorAll('.ev-menu-btn').forEach(btn => {
            if (btn === exceptBtn) return;
            setEvMenuState(btn, false);
        });
    }

    document.querySelectorAll('.ev-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            closeAllEvDropdowns(btn);
            setEvMenuState(btn, !isOpen);
        });
    });

    document.addEventListener('click', () => closeAllEvDropdowns(null));
});
