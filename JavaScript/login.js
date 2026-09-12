/* =========================================================================
   login.js — Solo para index.html (pantalla de inicio de sesión).
   No tiene nada que ver con la carcasa (sidebar/topbar); eso vive en
   shell.js y lo cargan estudiante.html/tutor.html/etc, no esta página.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
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
