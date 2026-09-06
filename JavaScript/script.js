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

    // Toggle for desktop/tablet (collapse sidebar)
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            if (window.innerWidth > 900) {
                shell.classList.toggle('sidebar-collapsed');
            } else {
                shell.classList.toggle('sidebar-open');
            }
        });
    }

    // Toggle for mobile (open sidebar from topbar)
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            shell.classList.toggle('sidebar-open');
        });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 900) {
            const sidebar = document.querySelector('.student-sidebar');
            if (shell.classList.contains('sidebar-open') && 
                !sidebar.contains(event.target) && 
                (!sidebarToggle || !sidebarToggle.contains(event.target)) &&
                (!mobileMenuToggle || !mobileMenuToggle.contains(event.target))) {
                shell.classList.remove('sidebar-open');
            }
        }
    });
});
