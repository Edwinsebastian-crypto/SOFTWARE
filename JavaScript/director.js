document.addEventListener('DOMContentLoaded', () => {
    const btnCancel = document.querySelector('#crear-practica .cp-btn-cancel');
    const btnSave = document.querySelector('#crear-practica .cp-btn-save');
    const formInputs = document.querySelectorAll('#crear-practica input, #crear-practica select');
    const successModal = document.getElementById('successModal');
    const modalAceptar = document.getElementById('modalAceptar');

    const crearRoot = document.querySelector('#crear-practica');

    if (btnCancel && crearRoot) {
        btnCancel.addEventListener('click', () => {
            formInputs.forEach(input => {
                if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                } else {
                    input.value = '';
                }
            });
            resetCustomSelectsInRoot(crearRoot);
        });
    }

    if (btnSave) {
        btnSave.addEventListener('click', () => {
            successModal.style.display = 'flex';
        });
    }

    if (modalAceptar) {
        modalAceptar.addEventListener('click', () => {
            successModal.style.display = 'none';
            if (btnCancel) btnCancel.click();
        });
    }

    document.querySelectorAll('.cp-date-input').forEach(input => {
        input.addEventListener('click', function () {
            if (typeof this.showPicker === 'function') {
                try { this.showPicker(); } catch (e) { /* noop */ }
            }
        });
    });

    function resetCustomSelectsInRoot(root) {
        root.querySelectorAll('.cp-input-wrap select').forEach(select => {
            const trigger = select.parentElement.querySelector('.custom-select-trigger');
            const firstOption = select.options[0];
            const chevron = select.parentElement.querySelector('.right-icon');
            select.selectedIndex = 0;
            if (trigger && firstOption) {
                trigger.textContent = firstOption.text;
                if (firstOption.disabled) trigger.classList.add('is-placeholder');
                else trigger.classList.remove('is-placeholder');
            }
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        });
    }

    function initCustomSelects(rootSelector) {
        const root = document.querySelector(rootSelector);
        if (!root) return;

        const selects = root.querySelectorAll('.cp-input-wrap select');
        selects.forEach(select => {
            if (select.classList.contains('hidden-select')) return;

            select.classList.add('hidden-select');
            const wrapper = select.parentElement;
            const chevron = wrapper.querySelector('.right-icon');

            const customSelectContainer = document.createElement('div');
            customSelectContainer.className = 'custom-select-container';

            const trigger = document.createElement('div');
            trigger.className = 'custom-select-trigger';

            const firstOption = select.options[0];
            trigger.textContent = firstOption ? firstOption.text : '';
            if (firstOption && firstOption.disabled) {
                trigger.classList.add('is-placeholder');
            }

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'custom-options';

            Array.from(select.options).forEach((option) => {
                if (option.disabled && option.value === '') return;

                const optionDiv = document.createElement('div');
                optionDiv.className = 'custom-option';
                optionDiv.textContent = option.text;
                optionDiv.dataset.value = option.value;

                optionDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    select.value = option.value;
                    trigger.textContent = option.text;
                    trigger.classList.remove('is-placeholder');
                    optionsContainer.classList.remove('open');
                    if (chevron) chevron.style.transform = 'rotate(0deg)';
                });
                optionsContainer.appendChild(optionDiv);
            });

            function toggleDropdown(e) {
                e.stopPropagation();
                document.querySelectorAll('.custom-options').forEach(opt => {
                    if (opt !== optionsContainer) opt.classList.remove('open');
                });
                document.querySelectorAll('.cp-input-wrap .right-icon').forEach(ic => {
                    if (ic !== chevron) ic.style.transform = 'rotate(0deg)';
                });
                const isOpen = optionsContainer.classList.toggle('open');
                if (chevron) chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
            }

            trigger.addEventListener('click', toggleDropdown);

            if (chevron) {
                chevron.style.cursor = 'pointer';
                chevron.style.transition = 'transform 0.2s ease';
                chevron.addEventListener('click', toggleDropdown);
            }

            customSelectContainer.appendChild(trigger);
            customSelectContainer.appendChild(optionsContainer);
            wrapper.appendChild(customSelectContainer);
        });
    }

    if (!document.documentElement.dataset.customSelectOutsideBound) {
        document.documentElement.dataset.customSelectOutsideBound = '1';
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-options').forEach(opt => opt.classList.remove('open'));
            document.querySelectorAll('.cp-input-wrap .right-icon').forEach(ic => {
                ic.style.transform = 'rotate(0deg)';
            });
        });
    }

    initCustomSelects('#crear-practica');
    initCustomSelects('#gestionar-practicas');

    const informesTabIds = ['tab-general', 'tab-tipos', 'tab-bitacoras', 'tab-retro', 'tab-instituciones'];
    const informesTabBtns = document.querySelectorAll('#informes .informes-tab-btn');

    informesTabBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            informesTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            informesTabIds.forEach((panelId, panelIdx) => {
                const panel = document.getElementById(panelId);
                if (!panel) return;
                panel.style.display = panelIdx === idx ? '' : 'none';
            });
        });
    });

    const gtpTabBtns = document.querySelectorAll('#gestionar-practicas .gtp-tab-btn');
    gtpTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const panelId = btn.getAttribute('data-gtp-panel');
            if (!panelId) return;

            gtpTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('#gestionar-practicas .gtp-panel').forEach(panel => {
                panel.style.display = panel.id === panelId ? '' : 'none';
            });
        });
    });

    const gtpForm = document.getElementById('gtp-form-registrar');
    const gtpCancel = document.getElementById('gtp-btn-cancel');
    const gtpRoot = document.querySelector('#gestionar-practicas');

    function clearGtpForm() {
        if (!gtpForm) return;
        gtpForm.reset();
        if (gtpRoot) resetCustomSelectsInRoot(gtpRoot);
    }

    if (gtpCancel) {
        gtpCancel.addEventListener('click', clearGtpForm);
    }

    const gtpHorasInput = document.getElementById('gtp-horas');
    if (gtpHorasInput) {
        gtpHorasInput.addEventListener('input', () => {
            gtpHorasInput.value = gtpHorasInput.value.replace(/\D/g, '');
        });
    }

    const gtpTypeList = document.getElementById('gtp-type-list');

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function nextGtpCodigo() {
        const cards = gtpTypeList ? gtpTypeList.querySelectorAll('.gtp-type-card') : [];
        let max = 0;
        cards.forEach(card => {
            const code = card.getAttribute('data-codigo') || '';
            const match = code.match(/TIP-(\d+)/i);
            if (match) max = Math.max(max, parseInt(match[1], 10));
        });
        return `TIP-${String(max + 1).padStart(3, '0')}`;
    }

    function buildGtpTypeCard(nombre, semestre, horas, codigo) {
        const article = document.createElement('article');
        article.className = 'ev-card gtp-type-card';
        article.setAttribute('data-codigo', codigo);
        article.innerHTML = `
            <div class="ev-card-body gtp-type-card-body">
                <p class="gtp-type-label">Tipo de práctica</p>
                <p class="ev-card-title gtp-type-name">${escapeHtml(nombre)}</p>
                <p class="gtp-type-meta">
                    <span class="gtp-meta-item"><span class="gtp-meta-key">Código de Práctica</span> ${escapeHtml(codigo)}</span>
                    <span class="gtp-meta-sep" aria-hidden="true">|</span>
                    <span class="gtp-meta-item"><span class="gtp-meta-key">Semestre</span> ${escapeHtml(semestre)}</span>
                    <span class="gtp-meta-sep" aria-hidden="true">|</span>
                    <span class="gtp-meta-item"><span class="gtp-meta-key">Horas</span> ${escapeHtml(horas)}</span>
                </p>
            </div>
            <div class="ev-menu-wrapper">
                <button type="button" class="ev-menu-btn" aria-label="Opciones del tipo de práctica" aria-expanded="false">
                    <i class="fa-solid fa-ellipsis" aria-hidden="true"></i>
                </button>
                <div class="ev-dropdown" role="menu">
                    <button type="button" class="ev-dropdown-item ev-item--ver" role="menuitem"><i class="fa-solid fa-eye" aria-hidden="true"></i> Ver</button>
                    <button type="button" class="ev-dropdown-item ev-item--editar" role="menuitem"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Editar</button>
                    <button type="button" class="ev-dropdown-item ev-item--eliminar" role="menuitem"><i class="fa-solid fa-trash" aria-hidden="true"></i> Eliminar</button>
                </div>
            </div>`;
        return article;
    }

    function closeAllEntityDropdowns(exceptBtn) {
        document.querySelectorAll('#gestionar-practicas .ev-menu-btn, #gestionar-instituciones .ev-menu-btn').forEach(btn => {
            if (btn === exceptBtn) return;
            btn.setAttribute('aria-expanded', 'false');
            const dd = btn.nextElementSibling;
            if (dd) dd.classList.remove('is-open');
        });
    }

    function bindEntityListInteractions(root, cardSelector) {
        if (!root) return;
        root.addEventListener('click', (e) => {
            const menuBtn = e.target.closest('.ev-menu-btn');
            if (menuBtn && root.contains(menuBtn)) {
                e.stopPropagation();
                const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
                closeAllEntityDropdowns(menuBtn);
                const dd = menuBtn.nextElementSibling;
                if (!isOpen) {
                    menuBtn.setAttribute('aria-expanded', 'true');
                    if (dd) dd.classList.add('is-open');
                } else {
                    menuBtn.setAttribute('aria-expanded', 'false');
                    if (dd) dd.classList.remove('is-open');
                }
                return;
            }

            const elimBtn = e.target.closest('.ev-item--eliminar');
            if (elimBtn && root.contains(elimBtn)) {
                const card = elimBtn.closest(cardSelector);
                if (card) card.remove();
                closeAllEntityDropdowns(null);
            }
        });
    }

    bindEntityListInteractions(gtpRoot, '.gtp-type-card');
    document.addEventListener('click', () => closeAllEntityDropdowns(null));

    if (gtpForm) {
        gtpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('gtp-nombre')?.value.trim();
            const semestre = document.getElementById('gtp-semestre')?.value;
            const horas = document.getElementById('gtp-horas')?.value.trim();
            if (!nombre || !semestre || !horas || !/^\d+$/.test(horas)) return;

            if (gtpTypeList) {
                const codigo = nextGtpCodigo();
                gtpTypeList.appendChild(buildGtpTypeCard(nombre, semestre, horas, codigo));
            }

            clearGtpForm();
        });
    }

    const instTabBtns = document.querySelectorAll('#gestionar-instituciones .inst-tab-btn');
    instTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const panelId = btn.getAttribute('data-inst-panel');
            if (!panelId) return;

            instTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('#gestionar-instituciones .inst-panel').forEach(panel => {
                panel.style.display = panel.id === panelId ? '' : 'none';
            });
        });
    });

    const instForm = document.getElementById('inst-form-registrar');
    const instCancel = document.getElementById('inst-btn-cancel');
    const instRoot = document.querySelector('#gestionar-instituciones');
    const instEntityList = document.getElementById('inst-entity-list');
    const instNitInput = document.getElementById('inst-nit');

    function clearInstForm() {
        if (!instForm) return;
        instForm.reset();
    }

    if (instCancel) {
        instCancel.addEventListener('click', clearInstForm);
    }

    if (instNitInput) {
        instNitInput.addEventListener('input', () => {
            instNitInput.value = instNitInput.value.replace(/[^\d-]/g, '');
        });
    }

    function buildInstEntityCard(nit, encargado, direccion, nombre, correo) {
        const article = document.createElement('article');
        article.className = 'ev-card inst-entity-card';
        article.setAttribute('data-nit', nit);
        article.innerHTML = `
            <div class="ev-card-body">
                <p class="entity-card-label">Institución</p>
                <p class="ev-card-title">${escapeHtml(nombre)}</p>
                <p class="entity-card-meta">
                    <span class="entity-meta-item"><span class="entity-meta-key">NIT</span> ${escapeHtml(nit)}</span>
                    <span class="entity-meta-sep" aria-hidden="true">|</span>
                    <span class="entity-meta-item"><span class="entity-meta-key">Encargado</span> ${escapeHtml(encargado)}</span>
                    <span class="entity-meta-sep" aria-hidden="true">|</span>
                    <span class="entity-meta-item"><span class="entity-meta-key">Correo</span> ${escapeHtml(correo)}</span>
                </p>
                <p class="entity-card-desc">${escapeHtml(direccion)}</p>
            </div>
            <div class="ev-menu-wrapper">
                <button type="button" class="ev-menu-btn" aria-label="Opciones de la institución" aria-expanded="false">
                    <i class="fa-solid fa-ellipsis" aria-hidden="true"></i>
                </button>
                <div class="ev-dropdown" role="menu">
                    <button type="button" class="ev-dropdown-item ev-item--ver" role="menuitem"><i class="fa-solid fa-eye" aria-hidden="true"></i> Ver</button>
                    <button type="button" class="ev-dropdown-item ev-item--editar" role="menuitem"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Editar</button>
                    <button type="button" class="ev-dropdown-item ev-item--eliminar" role="menuitem"><i class="fa-solid fa-trash" aria-hidden="true"></i> Eliminar</button>
                </div>
            </div>`;
        return article;
    }

    bindEntityListInteractions(instRoot, '.inst-entity-card');

    if (instForm) {
        instForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nit = document.getElementById('inst-nit')?.value.trim();
            const encargado = document.getElementById('inst-encargado')?.value.trim();
            const direccion = document.getElementById('inst-direccion')?.value.trim();
            const nombre = document.getElementById('inst-nombre')?.value.trim();
            const correo = document.getElementById('inst-correo')?.value.trim();
            if (!nit || !encargado || !direccion || !nombre || !correo) return;
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return;

            if (instEntityList) {
                instEntityList.appendChild(buildInstEntityCard(nit, encargado, direccion, nombre, correo));
            }

            clearInstForm();
        });
    }
});
