// Lógica específica para la vista de Estudiante
document.addEventListener('DOMContentLoaded', () => {
    const btnEntrar = document.querySelector('.practice-submit');
    const practicePanel = document.querySelector('.practice-panel');
    const bitacoraPanel = document.getElementById('bitacora-panel');
    const bitacoraBackBtn = document.getElementById('bitacoraBack');
    
    const actividadesPanel = document.getElementById('actividades-panel');
    const actividadesBackBtn = document.getElementById('actividadesBack');
    const actividadesBtn = document.getElementById('actividades-btn');


    function resetScroll() {
        window.scrollTo(0, 0);
        const wrapper = document.querySelector('.practice-content-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
        const appShell = document.querySelector('.app-shell');
        if (appShell) appShell.scrollTop = 0;
    }
    
    // Entrar a Bitácora desde Práctica
    if (btnEntrar && practicePanel && bitacoraPanel) {
        btnEntrar.addEventListener('click', () => {
            practicePanel.style.display = 'none';
            bitacoraPanel.style.display = 'flex';
            resetScroll();
        });
    }
    
    // Volver a Práctica desde Bitácora
    if (bitacoraBackBtn && practicePanel && bitacoraPanel) {
        bitacoraBackBtn.addEventListener('click', () => {
            bitacoraPanel.style.display = 'none';
            practicePanel.style.display = 'block';
            resetScroll();
        });
    }

    // Entrar a Actividades desde Bitácora
    if (actividadesBtn && bitacoraPanel && actividadesPanel) {
        actividadesBtn.addEventListener('click', () => {
            bitacoraPanel.style.display = 'none';
            actividadesPanel.style.display = 'flex';
            resetScroll();
        });
    }

    // Volver a Bitácora desde Actividades
    if (actividadesBackBtn && bitacoraPanel && actividadesPanel) {
        actividadesBackBtn.addEventListener('click', () => {
            actividadesPanel.style.display = 'none';
            bitacoraPanel.style.display = 'flex';
            resetScroll();
        });
    }

});