// ============================================================
// INICIO DE SESIÓN CON GOOGLE
// ============================================================
function manejarRespuestaGoogle(response) {
    const datosUsuario = decodificarJwt(response.credential);
    
    const paqueteDatos = {
        googleId: datosUsuario.sub,
        nombre: datosUsuario.name,
        correo: datosUsuario.email
    };

    // Aquí le mandamos los datos al servidor
    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paqueteDatos)
    })
    .then(respuesta => respuesta.json())
    .then(data => {
        console.log("Respuesta del servidor:", data.mensaje);
        alert("¡" + data.mensaje + ", " + paqueteDatos.nombre + "!");
    })
    .catch(error => {
        console.error("Error al enviar datos al servidor:", error);
    });
}

function decodificarJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// ============================================================
// MODALES DE LA MISIÓN AMBIENTAL
// ============================================================
const INFO_CARDS = {
    domestico: {
        titulo: 'Ahorro Doméstico',
        desc: 'Pequeños cambios en tus hábitos diarios pueden representar un ahorro significativo de agua en el hogar.',
        puntos: [
            '🚿 Una ducha de 5 min gasta 50 L menos que una de 15 min',
            '🚰 Cerrar la llave al cepillarte ahorra hasta 35 L al día',
            '🚽 Un inodoro dual reduce el consumo hasta en un 60%',
            '🪣 Lavar platos con cubeta ahorra hasta 50 L por lavada',
            '👕 Lavar con carga completa ahorra hasta 30 L por ciclo',
        ],
        btnTexto: 'Ver todos los consejos →',
        btnLink: 'consejos.html'
    },
    consumo: {
        titulo: 'Consumo Consciente',
        desc: 'Conocer tu consumo real es el primer paso para reducirlo. Nuestra calculadora te da una estimación personalizada.',
        puntos: [
            '📊 El mexicano promedio usa 370 L de agua al día',
            '📉 Con buenos hábitos puedes reducirlo hasta un 40%',
            '⚖️ Calcula tu consumo y compara con la semana anterior',
            '📄 Descarga tu informe en PDF con consejos personalizados',
            '👤 Lleva un seguimiento semanal si inicias sesión',
        ],
        btnTexto: 'Calcular mi consumo →',
        btnLink: 'calculadora.html'
    },
    futuro: {
        titulo: 'Futuro Sostenible',
        desc: 'El agua es un recurso limitado. Entender su importancia nos ayuda a cuidarla mejor para las próximas generaciones.',
        puntos: [
            '🌍 Solo el 3% del agua del planeta es dulce y accesible',
            '🇲🇽 México enfrenta estrés hídrico en más del 50% de su territorio',
            '📚 La educación hídrica reduce el consumo hasta un 25%',
            '♻️ El agua reutilizada puede cubrir hasta el 30% del consumo doméstico',
            '💧 Chiapas tiene agua abundante — pero también hay que cuidarla',
        ],
        btnTexto: 'Conocer la importancia →',
        btnLink: 'importancia.html'
    }
};

function abrirModalInfo(tipo) {
    const data = INFO_CARDS[tipo];
    if (!data) return;

    // Aquí quité la línea del emoji porque tu compañera no lo definió en las tarjetas de arriba, 
    // pero los iconos de los puntos seguirán funcionando.
    document.getElementById('modal-info-titulo').textContent = data.titulo;
    document.getElementById('modal-info-desc').textContent   = data.desc;

    document.getElementById('modal-info-puntos').innerHTML = data.puntos
        .map(p => `<li style="display:flex;align-items:flex-start;gap:0.5rem;font-size:0.88rem;color:#334155;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:0.6rem 0.85rem;">${p}</li>`)
        .join('');

    const btn = document.getElementById('modal-info-btn');
    btn.textContent = data.btnTexto;
    btn.href        = data.btnLink;

    const overlay = document.getElementById('modal-info-overlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarModalInfo() {
    document.getElementById('modal-info-overlay').style.display = 'none';
    document.body.style.overflow = '';
}

// Cerrar con la tecla ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModalInfo();
});