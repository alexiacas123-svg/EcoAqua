document.addEventListener("DOMContentLoaded", () => {
    const feedbackCard = document.querySelector(".feedback-card");
    const usuarioGuardado = localStorage.getItem("usuarioEcoAqua");

    // Si NO ha iniciado sesión, mostramos el candado
    if (!usuarioGuardado) {
        feedbackCard.innerHTML = `
            <div style="text-align: center; padding: 2rem 1rem;">
                <i data-lucide="lock" style="color: #94a3b8; width: 32px; height: 32px; margin-bottom: 1rem;"></i>
                <p style="color: #64748b; margin-bottom: 1.5rem; font-weight: 500;">
                    Inicia sesión con Google para dejar un comentario y calificar EcoAqua.
                </p>
                <a href="login.html" class="btn btn-primary" style="text-decoration: none;">Iniciar Sesión</a>
            </div>
        `;
        lucide.createIcons();
        return; // Detiene el código aquí
    }

    // --- SI LLEGAMOS AQUÍ, EL USUARIO SÍ INICIÓ SESIÓN ---
    const usuario = JSON.parse(usuarioGuardado);
    
    // Atrapamos los elementos de tu diseño
    const btnEnviar = document.querySelector('.send-btn');
    const textArea = document.querySelector('.feedback-textarea');
    const btnSmile = document.querySelector('.reaction-btn[title="¡Me encanta!"]');
    const btnFrown = document.querySelector('.reaction-btn[title="Puede mejorar"]');
    
    // Por defecto, asumimos que elegirá la carita feliz
    let reaccionElegida = 'smile';

    // Efecto visual para seleccionar la carita feliz
    btnSmile.addEventListener('click', () => {
        reaccionElegida = 'smile';
        btnSmile.style.opacity = '1';
        btnFrown.style.opacity = '0.5';
    });

    // Efecto visual para seleccionar la carita triste
    btnFrown.addEventListener('click', () => {
        reaccionElegida = 'frown';
        btnFrown.style.opacity = '1';
        btnSmile.style.opacity = '0.5';
    });

    // Acción del botón principal "Enviar"
    btnEnviar.addEventListener('click', () => {
        // Cambiamos el botón para que sepa que está cargando
        const textoOriginal = btnEnviar.innerHTML;
        btnEnviar.innerHTML = '<span>Enviando...</span>';

        const paqueteDatos = {
            nombre: usuario.nombre,
            correo: usuario.correo,
            mensaje: textArea.value,
            reaccion: reaccionElegida
        };

        // Lo mandamos a nuestro servidor (Node.js)
        fetch('/api/enviar-comentario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paqueteDatos)
        })
        .then(res => res.json())
        .then(data => {
            // ¡MAGIA! Actualizamos los números de las caritas con los datos reales de AWS
            btnSmile.querySelector('.reaction-count').innerText = data.felices || 0;
            btnFrown.querySelector('.reaction-count').innerText = data.tristes || 0;
            
            alert("¡Gracias! Tu comentario ha sido enviado.");
            textArea.value = ""; // Vaciamos la caja de texto
            btnEnviar.innerHTML = textoOriginal; // Regresamos el botón a la normalidad
            lucide.createIcons(); // Recargamos los iconos
        })
        .catch(error => {
            console.error("Error al enviar:", error);
            alert("Hubo un problema, asegúrate de que el servidor esté encendido.");
            btnEnviar.innerHTML = textoOriginal;
            lucide.createIcons();
        });
    });
});