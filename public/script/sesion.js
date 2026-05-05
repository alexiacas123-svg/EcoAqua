// Archivo: script/sesion.js
document.addEventListener("DOMContentLoaded", () => {
    const usuarioGuardado = localStorage.getItem("usuarioEcoAqua");
    const btnLogin = document.getElementById('boton-acceso'); 

    if (usuarioGuardado && btnLogin) {
        const usuario = JSON.parse(usuarioGuardado);
        
        btnLogin.innerHTML = `<i data-lucide="user"></i> ${usuario.nombre.split(' ')[0]}`;
        btnLogin.removeAttribute('onclick');
        
        btnLogin.addEventListener('click', () => {
            const confirmar = confirm(`¿Deseas cerrar tu sesión, ${usuario.nombre.split(' ')[0]}?`);
            if (confirmar) {
                localStorage.removeItem("usuarioEcoAqua");
                window.location.reload();
            }
        });
        
        if(window.lucide) lucide.createIcons();
    }
});