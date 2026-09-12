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
