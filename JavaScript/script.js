document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const shell = document.querySelector('.student-shell');
    const themeToggle = document.getElementById('themeToggle');

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            const icon = themeToggle.querySelector('i:first-child');
            const text = themeToggle.querySelector('span');

            if (isDark) {
                icon.classList.remove('fa-sun', 'fa-regular');
                icon.classList.add('fa-moon', 'fa-solid');
                text.textContent = 'Oscuro';
            } else {
                icon.classList.remove('fa-moon', 'fa-solid');
                icon.classList.add('fa-sun', 'fa-regular');
                text.textContent = 'Claro';
            }
        });
    }

    // --- Menú móvil: bloqueo real del scroll de fondo (estilo Classroom) ---
    // Al abrir, se "congela" la página en su posición actual con position:fixed
    // para que ningún gesto de scroll se escape hacia el contenido principal.
    // El menú (student-sidebar) sigue haciendo scroll interno normalmente.
    let lockedScrollY = 0;

    function openMobileMenu() {
        lockedScrollY = window.scrollY || window.pageYOffset;
        document.body.style.top = `-${lockedScrollY}px`;
        shell.classList.add('sidebar-open');
        document.body.classList.add('menu-open');
        document.documentElement.classList.add('menu-open');
    }

    function closeMobileMenu() {
        shell.classList.remove('sidebar-open');
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo(0, lockedScrollY);
    }

    function toggleMobileMenu() {
        if (shell.classList.contains('sidebar-open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Toggle for desktop/tablet (collapse sidebar) or mobile (open drawer)
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            if (window.innerWidth > 900) {
                shell.classList.toggle('sidebar-collapsed');
            } else {
                toggleMobileMenu();
            }
        });
    }

    // Toggle for mobile (open sidebar from topbar)
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 900) {
            const sidebar = document.querySelector('.student-sidebar');
            if (shell.classList.contains('sidebar-open') &&
                !sidebar.contains(event.target) &&
                (!sidebarToggle || !sidebarToggle.contains(event.target)) &&
                (!mobileMenuToggle || !mobileMenuToggle.contains(event.target))) {
                closeMobileMenu();
            }
        }
    });

    // Si la ventana pasa a tamaño de escritorio con el menú móvil abierto, se limpia el bloqueo
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && shell.classList.contains('sidebar-open')) {
            closeMobileMenu();
        }
    });
});
