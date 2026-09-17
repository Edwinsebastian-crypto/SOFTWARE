document.addEventListener('DOMContentLoaded', () => {
    const btnCancel = document.querySelector('.cp-btn-cancel');
    const btnSave = document.querySelector('.cp-btn-save');
    const formInputs = document.querySelectorAll('#crear-practica input, #crear-practica select');
    const successModal = document.getElementById('successModal');
    const modalAceptar = document.getElementById('modalAceptar');

    if(btnCancel) {
        btnCancel.addEventListener('click', () => {
            formInputs.forEach(input => {
                if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                } else {
                    input.value = '';
                }
            });
        });
    }

    if(btnSave) {
        btnSave.addEventListener('click', () => {
            successModal.style.display = 'flex';
        });
    }

    if(modalAceptar) {
        modalAceptar.addEventListener('click', () => {
            successModal.style.display = 'none';
            if(btnCancel) btnCancel.click(); // Limpia el formulario
        });
    }


    // --- Abrir calendar picker en el primer clic (móvil y escritorio) ---
    document.querySelectorAll('.cp-date-input').forEach(input => {
        input.addEventListener('click', function() {
            if (typeof this.showPicker === 'function') {
                try { this.showPicker(); } catch(e) {}
            }
        });
    });

    // Initialize Custom Selects for Crear Práctica
    function initCustomSelects() {
        const selects = document.querySelectorAll('#crear-practica .cp-input-wrap select');
        selects.forEach(select => {
            select.classList.add('hidden-select');
            const wrapper = select.parentElement;

            // Make the chevron icon also trigger the dropdown
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
                if (option.disabled && option.value === '') return; // Skip placeholder in list

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

            // Shared toggle function
            function toggleDropdown(e) {
                e.stopPropagation();
                // Close all others
                document.querySelectorAll('.custom-options').forEach(opt => {
                    if (opt !== optionsContainer) opt.classList.remove('open');
                });
                // Reset other chevrons
                document.querySelectorAll('#crear-practica .right-icon').forEach(ic => {
                    if (ic !== chevron) ic.style.transform = 'rotate(0deg)';
                });
                const isOpen = optionsContainer.classList.toggle('open');
                if (chevron) chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
            }

            trigger.addEventListener('click', toggleDropdown);

            // Attach to chevron icon too
            if (chevron) {
                chevron.style.cursor = 'pointer';
                chevron.style.transition = 'transform 0.2s ease';
                chevron.addEventListener('click', toggleDropdown);
            }

            customSelectContainer.appendChild(trigger);
            customSelectContainer.appendChild(optionsContainer);
            wrapper.appendChild(customSelectContainer);
        });

        // Close options if clicked outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-options').forEach(opt => opt.classList.remove('open'));
            document.querySelectorAll('#crear-practica .right-icon').forEach(ic => ic.style.transform = 'rotate(0deg)');
        });

        // Update clear functionality to reset custom selects
        if(btnCancel) {
            btnCancel.addEventListener('click', () => {
                selects.forEach(select => {
                    const trigger = select.parentElement.querySelector('.custom-select-trigger');
                    const firstOption = select.options[0];
                    const chevron = select.parentElement.querySelector('.right-icon');
                    if (trigger && firstOption) {
                        trigger.textContent = firstOption.text;
                        if (firstOption.disabled) trigger.classList.add('is-placeholder');
                    }
                    if (chevron) chevron.style.transform = 'rotate(0deg)';
                });
            });
        }
    }

    initCustomSelects();



    // --- Tabs de Informes (General, Tipos, Bitacoras, Retro, Instituciones) ---
    // Mapea cada boton (por orden) con su panel id
    const informesTabIds = ['tab-general', 'tab-tipos', 'tab-bitacoras', 'tab-retro', 'tab-instituciones'];
    const informesTabBtns = document.querySelectorAll('.informes-tab-btn');

    if (informesTabBtns.length > 0) {
        informesTabBtns.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                // Activar boton
                informesTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Mostrar panel correspondiente
                informesTabIds.forEach((panelId, panelIdx) => {
                    const panel = document.getElementById(panelId);
                    if (!panel) return;
                    panel.style.display = panelIdx === idx ? '' : 'none';
                });
            });
        });
    }
});
