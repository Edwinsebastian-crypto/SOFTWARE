// --- Altura real visible en móvil ---
// En varios navegadores Android, la unidad CSS "dvh" no se recalcula bien apenas
// carga la página (queda como si la barra de direcciones no existiera), dejando
// contenido de más abajo (botón "Entrar", "Cerrar Sesión") fuera de la pantalla
// e inalcanzable por scroll. Esta variable --app-vh usa la altura real que
// reporta window.visualViewport (o innerHeight si no está disponible) y se
// actualiza en cada cambio, así el CSS siempre tiene la medida correcta.
function setAppViewportHeight() {
    const realHeight = (window.visualViewport ? window.visualViewport.height : window.innerHeight);
    document.documentElement.style.setProperty('--app-vh', (realHeight * 0.01) + 'px');
}
setAppViewportHeight();
window.addEventListener('resize', setAppViewportHeight);
window.addEventListener('orientationchange', setAppViewportHeight);
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setAppViewportHeight);
    window.visualViewport.addEventListener('scroll', setAppViewportHeight);
}

document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const shell = document.querySelector('.student-shell');
    const sidebar = document.querySelector('.student-sidebar');
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

    // Theme toggle
    if (themeToggleBtns.length > 0) {
        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                const isDark = document.body.classList.contains('dark-theme');
                
                themeToggleBtns.forEach(toggleBtn => {
                    const icon = toggleBtn.querySelector('i:first-child');
                    const text = toggleBtn.querySelector('span');

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
            });
        });
    }

    // Tab Navigation
    const navLinks = document.querySelectorAll('.student-nav-link');
    const sections = document.querySelectorAll('.student-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Actualizar enlaces
            navLinks.forEach(nav => {
                nav.classList.remove('student-nav-link--active');
                nav.removeAttribute('aria-current');
            });
            link.classList.add('student-nav-link--active');
            link.setAttribute('aria-current', 'page');
            
            // Mostrar sección correspondiente
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'flex'; // Usamos flex porque las secciones tienen display: flex en desktop
                } else {
                    section.style.display = 'none';
                }
            });

            // En móvil, cerrar el menú al seleccionar una opción
            if (isMobileLayout() && shell.classList.contains('sidebar-open')) {
                closeMobileMenu();
            }
        });
    });

    // --- Menú móvil ---
    // Debe coincidir exactamente con el media query de estudiante.css:
    // "@media (max-width:900px), (max-height:500px)". Un celular grande en
    // horizontal puede tener más de 900px de ancho pero poca altura, y debe
    // seguir tratándose como celular (drawer), no como escritorio (sidebar fijo).
    function isMobileLayout() {
        return window.innerWidth <= 900 || window.innerHeight <= 500;
    }

    // .student-shell es el contenedor que hace scroll en móvil (ver CSS).
    // En vez de cambiar su "overflow" para bloquear el scroll de fondo
    // (eso hace aparecer/desaparecer la barra de scroll y provoca un
    // reacomodo visible del contenido), se bloquea el gesto de scroll
    // directamente, dejando pasar libremente el que ocurre dentro del menú.
    function blockBackgroundScroll(event) {
        if (sidebar && !sidebar.contains(event.target)) {
            event.preventDefault();
        }
    }

    function openMobileMenu() {
        shell.classList.add('sidebar-open');
        shell.addEventListener('wheel', blockBackgroundScroll, { passive: false });
        shell.addEventListener('touchmove', blockBackgroundScroll, { passive: false });
    }

    function closeMobileMenu() {
        shell.classList.remove('sidebar-open');
        shell.removeEventListener('wheel', blockBackgroundScroll);
        shell.removeEventListener('touchmove', blockBackgroundScroll);
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
            if (!isMobileLayout()) {
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
        if (isMobileLayout()) {
            if (shell.classList.contains('sidebar-open') &&
                sidebar && !sidebar.contains(event.target) &&
                (!sidebarToggle || !sidebarToggle.contains(event.target)) &&
                (!mobileMenuToggle || !mobileMenuToggle.contains(event.target))) {
                closeMobileMenu();
            }
        }
    });

    // Si la ventana pasa a tamaño de escritorio con el menú móvil abierto, se limpia
    window.addEventListener('resize', () => {
        if (!isMobileLayout() && shell.classList.contains('sidebar-open')) {
            closeMobileMenu();
        }
    });
});
