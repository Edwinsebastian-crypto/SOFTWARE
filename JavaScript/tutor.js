// Lógica específica para la vista de Tutor
document.addEventListener('DOMContentLoaded', () => {
    const btnEntrar = document.querySelector('.practice-submit');
    const practicePanel = document.querySelector('.practice-panel');
    const practicaPanel = document.getElementById('practica-panel');
    const practicaBackBtn = document.getElementById('practicaBack');

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
    // El practica-panel tiene exactamente dos .b-action-btn: Actividades y Preguntas
    const practicaActionBtns = practicaPanel
        ? practicaPanel.querySelectorAll('.b-action-btn')
        : [];
    const actividadesEntrarpractica = practicaActionBtns[0] || null; // primer btn = Actividades
    const preguntasBtn = practicaActionBtns[1] || null; // segundo btn = Preguntas

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
    if (btnEntrar && practicePanel && practicaPanel) {
        btnEntrar.addEventListener('click', () => {
            practicePanel.style.display = 'none';
            practicaPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // ── Volver a Práctica desde Bitácora ──────────────────────────────────
    if (practicaBackBtn && practicePanel && practicaPanel) {
        practicaBackBtn.addEventListener('click', () => {
            practicaPanel.style.display = 'none';
            practicePanel.style.display = 'block';
            resetScroll();
        });
    }

    // ── Edición de Nota y Observación en Bitácora ─────────────────────────
    const practicaInfoCard = document.getElementById('practica-info-card');
    const notaDisplay = document.getElementById('nota-display');
    const notaInput = document.getElementById('nota-input');
    const obsDisplay = document.getElementById('obs-display');
    const obsInput = document.getElementById('obs-input');
    const editActions = document.getElementById('edit-actions');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const saveEditBtn = document.getElementById('save-edit-btn');

    if (practicaInfoCard && notaDisplay && notaInput && obsDisplay && obsInput && editActions) {
        practicaInfoCard.addEventListener('click', () => {
            // Solo habilitar si no están ya en modo edición
            if (notaInput.style.display === 'none') {
                notaInput.value = notaDisplay.textContent === 'Nota' ? '' : notaDisplay.textContent;
                const currentObs = obsDisplay.dataset.fullObs || obsDisplay.textContent;
                obsInput.value = currentObs === 'Observación' ? '' : currentObs;
                
                notaDisplay.style.display = 'none';
                obsDisplay.style.display = 'none';
                notaInput.style.display = 'block';
                obsInput.style.display = 'block';
                editActions.style.display = 'flex';
                
                notaInput.focus();
            }
        });

        cancelEditBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notaDisplay.style.display = 'block';
            obsDisplay.style.display = 'block';
            notaInput.style.display = 'none';
            obsInput.style.display = 'none';
            editActions.style.display = 'none';
        });

        saveEditBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nuevaNota = notaInput.value.trim();
            const nuevaObs = obsInput.value.trim();
            
            notaDisplay.textContent = nuevaNota || 'Nota';
            
            if (nuevaObs) {
                obsDisplay.dataset.fullObs = nuevaObs;
                obsDisplay.removeAttribute('title'); // Remove native tooltip
                const words = nuevaObs.split(/\s+/);
                if (words.length > 10) {
                    obsDisplay.textContent = words.slice(0, 10).join(' ') + '...';
                    obsDisplay.setAttribute('data-tooltip', nuevaObs); // Custom tooltip
                } else {
                    obsDisplay.textContent = nuevaObs;
                    obsDisplay.removeAttribute('data-tooltip');
                }
            } else {
                obsDisplay.textContent = 'Observación';
                obsDisplay.dataset.fullObs = '';
                obsDisplay.removeAttribute('title');
                obsDisplay.removeAttribute('data-tooltip');
            }
            
            notaDisplay.style.display = 'block';
            obsDisplay.style.display = 'block';
            notaInput.style.display = 'none';
            obsInput.style.display = 'none';
            editActions.style.display = 'none';
        });
        
        notaInput.addEventListener('click', (e) => e.stopPropagation());
        obsInput.addEventListener('click', (e) => e.stopPropagation());
    }

    // ── Entrar a Actividades desde Bitácora o Preguntas ───────────────────────────────
    if (actividadesEntrarpractica && practicaPanel && actividadesPanel) {
        actividadesEntrarpractica.addEventListener('click', () => {
            practicaPanel.style.display = 'none';
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
    if (actividadesBackBtn && practicaPanel && actividadesPanel) {
        actividadesBackBtn.addEventListener('click', () => {
            actividadesPanel.style.display = 'none';
            practicaPanel.style.display = 'flex';
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
                    evidenciasTitleEl.textContent = `Actividad #${numActividad}`;
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
    if (preguntasBtn && practicaPanel && preguntasPanel) {
        preguntasBtn.addEventListener('click', () => {
            practicaPanel.style.display = 'none';
            preguntasPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // ── Volver a Bitácora desde Preguntas ─────────────────────────────────
    if (preguntasBackBtn && practicaPanel && preguntasPanel) {
        preguntasBackBtn.addEventListener('click', () => {
            preguntasPanel.style.display = 'none';
            practicaPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // ── Menú "..." en tarjetas de Evidencias y Retroalimentaciones ────────
    // Panel flotante a la izquierda del botón (estilo director); el botón
    // permanece fijo al final y pasa a flecha ← al abrir.
    function setEvMenuState(btn, open) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');

        const dd = btn.nextElementSibling; // .ev-dropdown
        if (dd) dd.classList.toggle('is-open', open);

        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-ellipsis', !open);
            icon.classList.toggle('fa-arrow-left', open);
        }
    }

    function closeAllEvDropdowns(exceptBtn) {
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

    // Auto-crecer textarea y mantener visible el botón "Cancelar" mientras se escribe.
    // Antes se llamaba scrollIntoView({behavior:'smooth'}) en CADA tecla; como cada
    // llamada dispara su propia animación, escribir rápido apilaba varias animaciones
    // de scroll pisándose entre sí — eso era el texto "brincando" (y en el fondo, la
    // misma causa del bug de la barra superior en móvil: el contenedor de scroll
    // quedaba en un estado intermedio inconsistente hasta salir y volver a entrar).
    // Ahora: (1) se agrupan los eventos por fotograma con requestAnimationFrame en vez
    // de reaccionar a cada tecla suelta, (2) solo se mueve el scroll si el botón
    // realmente ya no es visible, y (3) el scroll es instantáneo (sin "smooth"), para
    // que nunca haya dos animaciones corriendo a la vez.
    if (retroTextarea) {
        let retroScrollRaf = null;
        retroTextarea.addEventListener('input', () => {
            retroTextarea.style.height = 'auto';
            retroTextarea.style.height = Math.min(retroTextarea.scrollHeight, 200) + 'px';

            if (!retroBtnCancel) return;
            if (retroScrollRaf) cancelAnimationFrame(retroScrollRaf);
            retroScrollRaf = requestAnimationFrame(() => {
                if (typeof scrollAppShellToReveal === 'function') {
                    scrollAppShellToReveal(retroBtnCancel);
                }
            });
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
/* --- Credencial Estudiante en practica --- */
function plantillaCredencialpractica(u) {
    const nombre = u.nombres + ' ' + u.apellidos;
    const doc = (u.docTipo || '-') + '  •  ' + (u.docNumero || '—');
    const estado = (u.estado || 'activo');
    const anio = new Date().getFullYear();
    return '' +
        '<article class="b-cred">' +
        '  <header class="b-cred-top">' +
        '    <div class="b-cred-brand">' +
        '      <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>' +
        '      <p>Credencial<br>universitaria <em>' + anio + '</em></p>' +
        '    </div>' +
        '    <span class="b-cred-state b-cred-state--' + estado + '">' + (estado.toUpperCase()) + '</span>' +
        '  </header>' +
        '  <div class="b-cred-body">' +
        '    <h3 class="b-cred-name">' + nombre + '</h3>' +
        '    <p class="b-cred-doc">' + doc + '</p>' +
        '    <span class="b-cred-role"><i class="fa-solid fa-user-graduate" aria-hidden="true"></i>Estudiante</span>' +
        '    <dl class="b-cred-meta">' +
        '      <div><dt>Programa académico</dt><dd>' + (u.programa || 'Sin asignar') + '</dd></div>' +
        '      <div><dt>Correo</dt><dd class="is-mono">' + (u.correo || 'usuario@unicesar.edu.co') + '</dd></div>' +
        '    </dl>' +
        '  </div>' +
        '</article>' +
        '<button type="button" class="b-modal-close" onclick="document.getElementById(\'b-modal-credencial\').style.display=\'none\'">Cerrar</button>';
}

document.addEventListener('click', (e) => {
    const studentNameEl = e.target.closest('.b-student-name');
    if (studentNameEl) {
        const mockStudent = {
            nombres: 'Edwin',
            apellidos: 'Pruebas',
            docTipo: 'CC',
            docNumero: '123456789',
            estado: 'activo',
            programa: 'Ingeniería de Sistemas',
            correo: 'epruebas@unicesar.edu.co'
        };
        const modal = document.getElementById('b-modal-credencial');
        const body = document.getElementById('b-modal-credencial-body');
        if (modal && body) {
            body.innerHTML = plantillaCredencialpractica(mockStudent);
            modal.style.display = 'flex';
        }
    }
});
/* =========================================================================
   asignar-actividad.js — Modal "Asignar Nueva Actividad" del panel Tutor.
   Se carga DESPUÉS de shell.js y tutor.js. No depende de sus variables
   internas (van dentro de su propio DOMContentLoaded), así que este
   archivo consulta el DOM directamente por id/clase.

   Qué hace:
     · Abre/cierra el modal (botón, X, click afuera, Cancelar, Escape)
     · Zona de "Adjuntar Evidencias" con arrastrar-y-soltar + clic
     · Al Confirmar, agrega una tarjeta "Actividad #N" nueva al listado
       y la conecta con el panel de Evidencias, igual que las demás.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('amOpenBtn');
    const modal = document.getElementById('am-modal');
    if (!openBtn || !modal) return; // Esta página no tiene el modal (por ahora solo Tutor)

    const closeX = document.getElementById('amModalCloseX');
    const btnCancel = document.getElementById('amBtnCancel');
    const form = document.getElementById('am-form');
    const dropzone = document.getElementById('am-dropzone');
    const fileInput = document.getElementById('am-file-input');
    const fileListEl = document.getElementById('am-file-list');
    const nombreInput = document.getElementById('am-nombre');

    const actividadesPanel = document.getElementById('actividades-panel');
    const evidenciasPanel = document.getElementById('evidencias-panel');
    const evidenciasTitleEl = document.getElementById('evidencias-title');

    let archivosSeleccionados = [];
    let ultimoFocoAntesDeAbrir = null;

    function resetScroll() {
        window.scrollTo(0, 0);
        const appShell = document.querySelector('.app-shell');
        if (appShell) appShell.scrollTop = 0;
        const wrapper = document.querySelector('.practice-content-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text == null ? '' : String(text);
        return div.innerHTML;
    }

    /* ---------------------------------------------------------------------
       Abrir / cerrar modal
       --------------------------------------------------------------------- */
    function abrirModal() {
        ultimoFocoAntesDeAbrir = document.activeElement;
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
        if (ultimoFocoAntesDeAbrir && typeof ultimoFocoAntesDeAbrir.focus === 'function') {
            ultimoFocoAntesDeAbrir.focus();
        }
    }

    openBtn.addEventListener('click', abrirModal);
    if (closeX) closeX.addEventListener('click', cerrarModal);
    if (btnCancel) btnCancel.addEventListener('click', cerrarModal);
    // modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); }); // Desactivado por petición del usuario
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') cerrarModal();
    });

    /* ---------------------------------------------------------------------
       Zona de arrastrar y soltar evidencias
       --------------------------------------------------------------------- */
    function agregarArchivos(fileList) {
        Array.from(fileList || []).forEach((f) => archivosSeleccionados.push(f));
        pintarArchivos();
    }

    function quitarArchivo(index) {
        archivosSeleccionados.splice(index, 1);
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
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput.click();
            }
        });

        ['dragenter', 'dragover'].forEach((evt) => {
            dropzone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('is-dragover');
            });
        });
        ['dragleave', 'drop'].forEach((evt) => {
            dropzone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('is-dragover');
            });
        });
        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files) agregarArchivos(dt.files);
        });

        fileInput.addEventListener('change', () => {
            agregarArchivos(fileInput.files);
            fileInput.value = ''; // permite volver a seleccionar el mismo archivo
        });
    }

    /* ---------------------------------------------------------------------
       Confirmar asignación → crea la tarjeta de la nueva actividad
       --------------------------------------------------------------------- */
    function siguienteNumeroActividad() {
        const tarjetas = actividadesPanel ? actividadesPanel.querySelectorAll('.actividad-entrar-btn') : [];
        let max = 0;
        tarjetas.forEach((btn) => {
            const n = parseInt(btn.getAttribute('data-actividad'), 10);
            if (!isNaN(n)) max = Math.max(max, n);
        });
        return max + 1;
    }

    function crearTarjetaActividad(numero, nombre) {
        const card = document.createElement('div');
        card.className = 'practica-action-card';
        card.innerHTML =
            '<div class="b-action-left">' +
            '<div class="stat-icon"><i class="fa-solid fa-file-lines" aria-hidden="true"></i></div>' +
            '<span class="b-action-label">Actividad #' + numero + (nombre ? ' — ' + escapeHtml(nombre) : '') + '</span>' +
            '</div>' +
            '<button type="button" class="b-action-btn actividad-entrar-btn" data-actividad="' + numero + '"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>';
        return card;
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = (nombreInput.value || '').trim();
            if (!nombre) {
                nombreInput.focus();
                nombreInput.classList.add('am-input-error');
                setTimeout(() => nombreInput.classList.remove('am-input-error'), 1200);
                return;
            }

            const numero = siguienteNumeroActividad();
            const nuevaTarjeta = crearTarjetaActividad(numero, nombre);
            if (actividadesPanel) actividadesPanel.appendChild(nuevaTarjeta);

            const btnEntrar = nuevaTarjeta.querySelector('.actividad-entrar-btn');
            if (btnEntrar && actividadesPanel && evidenciasPanel) {
                btnEntrar.addEventListener('click', () => {
                    if (evidenciasTitleEl) {
                        evidenciasTitleEl.textContent = `Actividad #${numero}`;
                    }
                    actividadesPanel.style.display = 'none';
                    evidenciasPanel.style.display = 'flex';
                    resetScroll();
                });
            }

            cerrarModal();
        });
    }
});

// L�gica para abrir el modal al Editar la actividad
document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.querySelector(".act-edit-btn");
    const modal = document.getElementById("am-modal");
    if (editBtn && modal) {
        editBtn.addEventListener("click", () => {
            const amTitle = document.getElementById("am-modal-title");
            if (amTitle) amTitle.textContent = "Editar Actividad";
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
            // Cierra el men� desplegable si est� abierto
            const dd = editBtn.closest(".ev-dropdown");
            if (dd) dd.classList.remove("is-open");
            const btnMenu = document.querySelector(".ev-menu-wrapper .ev-menu-btn");
            if (btnMenu) {
                btnMenu.setAttribute("aria-expanded", "false");
                const icon = btnMenu.querySelector("i");
                if (icon) {
                    icon.classList.add("fa-ellipsis");
                    icon.classList.remove("fa-arrow-left");
                }
            }
        });
    }
});
