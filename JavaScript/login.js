/* =========================================================================
   login.js — Solo para index.html (pantalla de inicio de sesión).
   No tiene nada que ver con la carcasa (sidebar/topbar); eso vive en
   shell.js y lo cargan estudiante.html/tutor.html/etc, no esta página.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Toggle de la visibilidad de contraseña en el Login
    const togglePassword = document.querySelector('.btn-visibility');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Login form logic (redirect based on selected role)
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const checkedRole = document.querySelector('input[name="role"]:checked');
            if (checkedRole) {
                window.location.href = `HTML/${checkedRole.id}.html`;
            }
        });
    }
});

/* ── Splash screen ── */
(function () {
    const splash = document.getElementById('spp-splash');
    if (!splash) return;

    let shouldShow = false;
    try {
        if (!sessionStorage.getItem('spp-intro-shown')) {
            sessionStorage.setItem('spp-intro-shown', '1');
            shouldShow = true;
        }
    } catch (e) {
        shouldShow = true; // Fallback
    }

    if (shouldShow) {
        splash.classList.remove('is-hidden');
        setTimeout(function () {
            splash.classList.add('splash-out');
            splash.addEventListener('animationend', function () {
                splash.remove();
            }, { once: true });
        }, 1700);
    } else {
        splash.remove();
    }
})();
