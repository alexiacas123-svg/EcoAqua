// ============================================================
// CALCULADORA DE CONSUMO ESTIMADO DE AGUA
// ============================================================

// -------------------------------------------------------
// ESTADO GLOBAL — guarda el último cálculo
// -------------------------------------------------------
let ultimoResultado = null;
let ultimaConfig    = null;

// Columna 1: Higiene Personal
const sliderDucha         = document.querySelector('.controls-grid > div:nth-child(1) .control-item:nth-child(2) input[type="range"]');
const toggleLlave         = document.querySelector('.controls-grid > div:nth-child(1) .control-item:nth-child(3) input[type="checkbox"]');
const toggleCepillo       = document.querySelector('.controls-grid > div:nth-child(1) .control-item:nth-child(4) input[type="checkbox"]');
const radioInodoroDual    = document.getElementById('sistemas-dual-1');
const radioInodoroNorm    = document.getElementById('sistemas-norm-1');
const toggleManos         = document.querySelector('.controls-grid > div:nth-child(1) .control-item:nth-child(6) input[type="checkbox"]');
const toggleAfeitado      = document.querySelector('.controls-grid > div:nth-child(1) .control-item:nth-child(7) input[type="checkbox"]');

// Columna 2: Hogar y Exterior
const togglePlatos        = document.querySelector('.controls-grid > div:nth-child(2) .control-item:nth-child(2) input[type="checkbox"]');
const sliderRopa          = document.querySelector('.controls-grid > div:nth-child(2) .control-item:nth-child(3) input[type="range"]');
const toggleCargaCompleta = document.querySelector('.controls-grid > div:nth-child(2) .control-item:nth-child(4) input[type="checkbox"]');
const radioAutoMang       = document.getElementById('auto-mang-1');
const radioAutoCubeta     = document.getElementById('auto-cubeta-1');
const sliderJardin        = document.querySelector('.controls-grid > div:nth-child(2) .control-item:nth-child(6) input[type="range"]');

// Resultados
const totalNumberEl  = document.querySelector('.total-number');
const totalFooterEl  = document.querySelector('.total-card-footer');
const breakdownItems = document.querySelectorAll('.breakdown-item');

// -------------------------------------------------------
// CONSEJOS POR CATEGORÍA
// -------------------------------------------------------
const CONSEJOS = {
  'Ducha': {
    icono: '🚿',
    titulo: 'Consejos para reducir el consumo en la Ducha',
    tips: [
      'Limita tu ducha a <strong>5 minutos</strong>. Puedes poner una alarma o música de 5 min para ayudarte.',
      'Cierra la llave mientras te enjabonas el cuerpo y el cabello — puedes ahorrar hasta <strong>50 litros por ducha</strong>.',
      'Instala una <strong>regadera de bajo consumo</strong> (4-6 L/min en vez de 10-15 L/min). Es el cambio con mayor impacto.',
      'Evita calentar el agua dejándola correr. Ten un balde cerca para capturar esa agua y usarla en el jardín o para limpiar.',
      'Si te duchas dos veces al día, considera si la segunda ducha es realmente necesaria o si puedes sustituirla por un baño de esponja.',
    ]
  },
  'Jardín': {
    icono: '🌳',
    titulo: 'Consejos para reducir el consumo en el Jardín',
    tips: [
      'Riega <strong>temprano por la mañana o al atardecer</strong> para reducir la evaporación hasta un 30%.',
      'Instala un sistema de <strong>riego por goteo</strong> — consume hasta 8 L/min menos que una manguera convencional.',
      'Recoge <strong>agua de lluvia</strong> en cubetas o tinacos para usarla en el riego sin gastar agua de la red.',
      'Elige <strong>plantas nativas o resistentes a la sequía</strong> que requieran menos riego frecuente.',
      'Cubre la tierra con <strong>mulch o composta</strong> alrededor de las plantas para retener la humedad y reducir la frecuencia de riego.',
    ]
  },
  'Sanitarios': {
    icono: '🚽',
    titulo: 'Consejos para reducir el consumo en Sanitarios',
    tips: [
      'Si tu inodoro es antiguo, considera cambiar a uno de <strong>doble descarga (dual)</strong>: gasta 4.5 L en vez de 12 L por uso.',
      'Coloca una botella llena de agua dentro del tanque del inodoro para reducir el volumen de agua por descarga.',
      'Revisa que no haya <strong>fugas en el tanque</strong>. Una fuga puede desperdiciar hasta 200 litros al día sin que te des cuenta.',
      'No uses el inodoro como basurero — cada jalón innecesario desperdicia entre 4 y 12 litros.',
      'Usa la descarga <strong>corta</strong> del sistema dual siempre que sea posible — solo necesitas la descarga grande cuando es necesario.',
    ]
  },
  'Ropa': {
    icono: '👕',
    titulo: 'Consejos para reducir el consumo en el Lavado de Ropa',
    tips: [
      'Lava siempre con la <strong>carga completa</strong>. Una lavadora a media carga usa casi la misma agua que una llena.',
      'Reduce las lavadas a <strong>2 veces por semana</strong> acumulando más ropa antes de lavar.',
      'Usa el <strong>programa de lavado rápido o eco</strong> de tu lavadora — consume hasta 40% menos agua.',
      'Reutiliza el agua del enjuague de la lavadora para limpiar pisos o el baño.',
      'Considera lavar ropa poco sucia <strong>a mano con una cubeta</strong> en vez de usar la lavadora para pocas prendas.',
    ]
  },
  'Lava Manos': {
    icono: '🧼',
    titulo: 'Consejos para reducir el consumo en Higiene Personal',
    tips: [
      'Cierra la llave <strong>mientras te enjabonas las manos</strong> — 30 segundos con llave abierta desperdicia casi 4 litros.',
      'Cierra la llave <strong>mientras te cepillas los dientes</strong>. Dejarla abierta gasta hasta 35 litros al día.',
      'Para afeitarte, llena un <strong>recipiente pequeño</strong> con agua en vez de dejar la llave abierta — reduces de 15 L a solo 3 L.',
      'Instala un <strong>aireador o reductor de flujo</strong> en los grifos del lavabo — reducen el caudal hasta un 50% sin afectar la experiencia.',
      'Usa <strong>jabón en barra</strong> en vez de jabón líquido de bomba — las personas tienden a enjuagarse más con jabón en barra, siendo más eficientes.',
    ]
  },
  'Lavado de Platos': {
    icono: '🍽️',
    titulo: 'Consejos para reducir el consumo en el Lavado de Platos',
    tips: [
      'Llena el fregadero o una <strong>cubeta con agua jabonosa</strong> para lavar todos los platos, en vez de dejar la llave abierta.',
      'Remoja los platos con restos difíciles antes de lavarlos — necesitarás menos agua para limpiarlos.',
      'Enjuaga todos los platos juntos al final en vez de enjuagar cada uno por separado.',
      'Si tienes <strong>lavavajillas</strong>, úsalo solo con carga completa — consume menos agua que lavar a mano con llave abierta.',
      'Reutiliza el agua del enjuague de los platos para regar plantas o limpiar el piso.',
    ]
  },
  'Auto': {
    icono: '🚗',
    titulo: 'Consejos para reducir el consumo en el Lavado de Auto',
    tips: [
      'Usa <strong>cubetas en vez de manguera</strong> — la manguera gasta 400 L por lavado, las cubetas solo 50 L.',
      'Lava el auto en un lugar donde el agua escurra hacia el jardín o una coladera que no vaya al drenaje.',
      'Usa <strong>productos de lavado sin agua</strong> (waterless car wash) para los lavados de mantenimiento entre lavados profundos.',
      'Reduce la frecuencia a <strong>una vez cada dos semanas</strong> salvo que sea realmente necesario.',
      'Usa una pistola de agua con <strong>gatillo automático</strong> si usas manguera — cortas el flujo cuando no estás enjuagando directamente.',
    ]
  },
};

// -------------------------------------------------------
// CREAR EL MODAL EN EL DOM (una sola vez)
// -------------------------------------------------------
function crearModal() {
  const modal = document.createElement('div');
  modal.id = 'modal-consejos';
  modal.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-box">

        <!-- Botón cerrar -->
        <button class="modal-close" id="modal-close">
          <i data-lucide="x" size="16"></i>
        </button>

        <!-- DOS COLUMNAS -->
        <div class="modal-columns">

          <!-- COLUMNA IZQUIERDA: Consejos -->
          <div class="modal-col-results">
            <div class="modal-header-top">
              <span class="modal-icon-cat" id="modal-icono"></span>
              <span class="modal-badge">Mayor consumo</span>
            </div>
            <h2 class="modal-titulo" id="modal-titulo"></h2>
            <ul class="modal-tips" id="modal-tips"></ul>
            <button class="modal-btn-cerrar" id="modal-btn-cerrar">¡Entendido, voy a mejorar!</button>
          </div>

          <!-- COLUMNA DERECHA: Resultados -->
          <div class="modal-col-tips">
            <div class="modal-col-title">
              <i data-lucide="bar-chart-2" size="16"></i> Tu Resumen
            </div>
            <div class="modal-total-card">
              <div class="modal-total-label">CONSUMO ESTIMADO TOTAL</div>
              <div class="modal-total-number-row">
                <span class="modal-total-drop">💧</span>
                <span class="modal-total-num" id="modal-total-num">0</span>
                <span class="modal-total-unit">L/sem</span>
              </div>
              <div class="modal-total-footer" id="modal-total-footer"></div>
            </div>
            <div class="modal-breakdown-title">Desglose de Consumo</div>
            <div class="modal-breakdown-list" id="modal-breakdown-list"></div>
          </div>

        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('modal-close').addEventListener('click', cerrarModal);
  document.getElementById('modal-btn-cerrar').addEventListener('click', cerrarModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) cerrarModal();
  });

  if (window.lucide) lucide.createIcons();
}

function abrirModal(nombreCategoria, resultado) {
  const data = CONSEJOS[nombreCategoria];
  if (!data) return;

  // -- Columna derecha: consejos --
  document.getElementById('modal-icono').textContent  = data.icono;
  document.getElementById('modal-titulo').textContent = data.titulo;

  document.getElementById('modal-tips').innerHTML = data.tips
    .map(tip => `
      <li>
        <span class="tip-num">💧</span>
        <span class="tip-texto">${tip}</span>
      </li>`)
    .join('');

  // -- Columna izquierda: resultados --
  const { totalGeneral, categorias } = resultado;

  document.getElementById('modal-total-num').textContent   = totalGeneral.toLocaleString('es-MX');
  document.getElementById('modal-total-footer').innerHTML  =
    `Equivalente a <strong>${Math.round(totalGeneral / 5).toLocaleString('es-MX')} botellas</strong> de agua.`;

  // Colores de las barras (mismo orden que en la página)
  const colores = ['fill-cyan','fill-teal','fill-purple','fill-gray','fill-pink','fill-orange','fill-yellow'];

  document.getElementById('modal-breakdown-list').innerHTML = categorias.map((cat, i) => {
    const pct = totalGeneral > 0 ? Math.round((cat.litros / totalGeneral) * 100) : 0;
    return `
      <div class="modal-breakdown-item">
        <div class="modal-breakdown-header">
          <span class="modal-breakdown-label">${cat.nombre}</span>
          <span class="modal-breakdown-value">${pct}%</span>
        </div>
        <div class="modal-progress-track">
          <div class="modal-progress-fill ${colores[i] || 'fill-cyan'}" style="width: ${Math.max(pct,1)}%"></div>
        </div>
      </div>`;
  }).join('');

  document.getElementById('modal-overlay').classList.add('modal-visible');
  document.body.style.overflow = 'hidden';

  if (window.lucide) lucide.createIcons();
}

function cerrarModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('modal-visible');
  document.body.style.overflow = '';
}

// -------------------------------------------------------
// FUNCIÓN PRINCIPAL DE CÁLCULO
// -------------------------------------------------------
function calcular() {

  const minDucha        = parseInt(sliderDucha?.value         ?? 15);
  const cierraLlave     = toggleLlave?.checked                ?? false;
  const cierraCepillo   = toggleCepillo?.checked              ?? false;
  const inodoroDual     = radioInodoroDual?.checked           ?? true;
  const cierraManos     = toggleManos?.checked                ?? false;
  const usaRecipiente   = toggleAfeitado?.checked             ?? true;
  const reutilizaPlatos = togglePlatos?.checked               ?? true;
  const vecesRopa       = parseInt(sliderRopa?.value          ?? 3);
  const cargaCompleta   = toggleCargaCompleta?.checked        ?? true;
  const usaCubeta       = radioAutoCubeta?.checked            ?? false;
  const minJardin       = parseInt(sliderJardin?.value        ?? 30);

  // ── Cálculos ──
  const lDuchaDia    = minDucha * 10;
  const lLlaveDia    = cierraLlave ? 0 : 50;
  const totalDucha   = (lDuchaDia + lLlaveDia) * 30;

  const lCepilloDia  = cierraCepillo ? (0.16 * 7 * 2) : (2.5 * 7 * 2);
  const totalCepillo = lCepilloDia * 30;

  const lInodoroDia  = inodoroDual ? (2 * 4.5) : (2 * 12);
  const totalInodoro = lInodoroDia * 30;

  const lManosDia    = cierraManos ? (1.5 * 8) : (0.7 * 8 * 8);
  const totalManos   = lManosDia * 30;

  const lAfeitadoDia  = usaRecipiente ? 3 : 15;
  const totalAfeitado = lAfeitadoDia * 30;

  const lPlatosDia   = reutilizaPlatos ? 30 : 80;
  const totalPlatos  = lPlatosDia * 30;

  const lPorCarga    = cargaCompleta ? 100 : 130;
  const totalRopa    = vecesRopa * lPorCarga * 4.3;

  const lAutoLavado  = usaCubeta ? 50 : 400;
  const totalAuto    = lAutoLavado * 4.3;

  const totalJardin  = minJardin * 18 * 4.3;

  const totalGeneral = Math.round(
    totalDucha + totalCepillo + totalInodoro + totalManos + totalAfeitado +
    totalPlatos + totalRopa + totalAuto + totalJardin
  );

  const categorias = [
    { nombre: 'Ducha',           litros: Math.round(totalDucha)   },
    { nombre: 'Jardín',          litros: Math.round(totalJardin)  },
    { nombre: 'Sanitarios',      litros: Math.round(totalInodoro) },
    { nombre: 'Ropa',            litros: Math.round(totalRopa)    },
    { nombre: 'Lava Manos',      litros: Math.round(totalManos + totalCepillo + totalAfeitado) },
    { nombre: 'Lavado de Platos',litros: Math.round(totalPlatos)  },
    { nombre: 'Auto',            litros: Math.round(totalAuto)    },
  ];

  // Guardar para el PDF
  ultimaConfig = {
    minDucha, cierraLlave, cierraCepillo,
    inodoroDual, cierraManos, usaRecipiente,
    reutilizaPlatos, vecesRopa, cargaCompleta,
    usaCubeta, minJardin
  };

  return { totalGeneral, categorias };
}

// -------------------------------------------------------
// ANIMACIÓN DEL NÚMERO TOTAL
// -------------------------------------------------------
function animarNumero(inicio, fin, duracion = 800) {
  const rango = fin - inicio;
  const t0    = performance.now();

  (function paso(t) {
    const progreso = Math.min((t - t0) / duracion, 1);
    const eased    = 1 - Math.pow(1 - progreso, 3);
    if (totalNumberEl) {
      totalNumberEl.textContent = Math.round(inicio + rango * eased).toLocaleString('es-MX');
    }
    if (progreso < 1) requestAnimationFrame(paso);
  })(t0);
}

// -------------------------------------------------------
// ACTUALIZAR UI
// -------------------------------------------------------
function actualizarUI(resultado) {
  const { totalGeneral, categorias } = resultado;

  if (totalFooterEl) {
    const botellas = Math.round(totalGeneral / 5);
    totalFooterEl.innerHTML = `Equivalente a <strong>${botellas.toLocaleString('es-MX')} botellas</strong> de agua.`;
  }

  breakdownItems.forEach((item, i) => {
    if (!categorias[i]) return;
    const litros = categorias[i].litros;
    const pct    = totalGeneral > 0 ? Math.round((litros / totalGeneral) * 100) : 0;

    const valueEl = item.querySelector('.breakdown-value');
    const fillEl  = item.querySelector('.progress-fill');

    if (valueEl) valueEl.textContent = `${pct}%`;
    if (fillEl) {
      fillEl.style.transition = 'none';
      fillEl.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fillEl.style.transition = 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
          fillEl.style.width = `${Math.max(pct, 1)}%`;
        });
      });
    }
  });
}

// -------------------------------------------------------
// ENCONTRAR LA CATEGORÍA CON MAYOR CONSUMO
// -------------------------------------------------------
function categoriaMaxima(categorias) {
  return categorias.reduce((max, cat) => cat.litros > max.litros ? cat : max, categorias[0]);
}

// -------------------------------------------------------
// BOTÓN "Calcular Consumo"
// -------------------------------------------------------
const btnCalcular = document.querySelector('.btn-calculate');

btnCalcular?.addEventListener('click', async () => {
  // =====================================================
  // 1. EL CADENERO (VALIDACIÓN DE SESIÓN)
  // =====================================================
  const usuarioGuardado = localStorage.getItem("usuarioEcoAqua");
  
  if (!usuarioGuardado) {
      alert("¡Hola! Para calcular tu consumo y crear tu historial, primero debes iniciar sesión.");
      
      // Aquí redirigimos al usuario. 
      // OJO: Cambia "login.html" por el nombre real de tu archivo de inicio de sesión
      window.location.href = "login.html"; 
      
      return; // El "return" es la magia que detiene TODO. No calcula ni anima nada.
  }

  // =====================================================
  // 2. SI SÍ HAY SESIÓN, HACEMOS LOS CÁLCULOS
  // =====================================================
  const anterior  = parseInt(totalNumberEl?.textContent?.replace(/,/g, '') ?? 0);
  const resultado = calcular();

  actualizarUI(resultado);
  animarNumero(anterior, resultado.totalGeneral, 800);
  ultimoResultado = resultado;

  // =====================================================
  // 3. GUARDAR EN LA BASE DE DATOS DE AWS
  // =====================================================
  const usuario = JSON.parse(usuarioGuardado);
  
  const getLitros = (nombreCat) => {
      const cat = resultado.categorias.find(c => c.nombre === nombreCat);
      return cat ? cat.litros : 0;
  };

  const datosParaGuardar = {
      googleId: usuario.googleId,
      totalLitros: resultado.totalGeneral,
      ducha: getLitros('Ducha'),
      manos: getLitros('Lava Manos'),
      jardin: getLitros('Jardín'),
      auto: getLitros('Auto'),
      ropa: getLitros('Ropa'),
      platos: getLitros('Lavado de Platos'),
      sanitarios: getLitros('Sanitarios')
  };

  try {
      const respuesta = await fetch('/api/guardar-consumo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosParaGuardar)
      });
      const data = await respuesta.json();
      console.log("☁️ Nube AWS:", data.mensaje);
  } catch (error) {
      console.error("Error al guardar en la nube:", error);
  }

  // =====================================================
  // 4. ACTUALIZAR EL DASHBOARD Y MOSTRAR MODAL
  // =====================================================
  if (window.actualizarDashboard) {
      window.actualizarDashboard(resultado);
  }

  setTimeout(() => {
    const mayor = categoriaMaxima(resultado.categorias);
    abrirModal(mayor.nombre, resultado);
  }, 900);
});



// -------------------------------------------------------
// GENERAR PDF con jsPDF (DISEÑO AESTHETIC V2 - MULTIPÁGINA)
// -------------------------------------------------------
function generarPDF() {
  if (!ultimoResultado) {
    alert('Primero presiona "Calcular Consumo" para generar tu informe.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const PW = 210, PH = 297, MARGIN = 20;

  // Paleta de colores minimalista y moderna (Estilo Tailwind)
  const C_PRIMARY = [6, 182, 212];   // Tu Cyan característico
  const C_DARK    = [15, 23, 42];    // Azul medianoche para títulos
  const C_TEXT    = [71, 85, 105];   // Gris texto base
  const C_MUTED   = [148, 163, 184]; // Gris clarito para textos secundarios
  const C_BG      = [248, 250, 252]; // Fondo muy sutil para tarjetas
  const C_BORDER  = [226, 232, 240]; // Gris súper claro para líneas divisorias

  let y = 0;

  // =======================================================
  // FUNCIÓN AUXILIAR: Dibujar la Cabecera en cualquier página
  // =======================================================
  const drawHeader = (pageTitle) => {
    // Franja de acento superior
    doc.setFillColor(...C_PRIMARY);
    doc.rect(0, 0, PW, 4, 'F'); 

    // Título AguaVida
    doc.setTextColor(...C_DARK);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('EcoAqua', MARGIN, MARGIN + 6);

    // Fecha a la derecha
    doc.setTextColor(...C_MUTED);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const fecha = new Date().toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' });
    doc.text(fecha, PW - MARGIN, MARGIN + 6, { align: 'right' });

    // Subtítulo de la página actual
    doc.setTextColor(...C_PRIMARY);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(pageTitle, MARGIN, MARGIN + 16);

    // Línea separadora limpia
    doc.setDrawColor(...C_BORDER);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, MARGIN + 21, PW - MARGIN, MARGIN + 21);
  };


  // =======================================================
  // PÁGINA 1: RESUMEN GENERAL
  // =======================================================
  drawHeader('Resumen de Consumo Estimado');
  y = MARGIN + 35;

  // ── Tarjeta Principal (Total) ──
  const cardH = 50;
  doc.setFillColor(...C_BG);
  doc.roundedRect(MARGIN, y, PW - MARGIN * 2, cardH, 3, 3, 'F');
  doc.setDrawColor(...C_BORDER);
  doc.roundedRect(MARGIN, y, PW - MARGIN * 2, cardH, 3, 3, 'S');

  doc.setTextColor(...C_TEXT);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CONSUMO TOTAL DEL MES', PW / 2, y + 12, { align: 'center' });

  doc.setTextColor(...C_PRIMARY);
  doc.setFontSize(38); // Más impacto
  doc.text(ultimoResultado.totalGeneral.toLocaleString('es-MX'), PW / 2, y + 28, { align: 'center' });

  doc.setTextColor(...C_MUTED);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('litros / mes', PW / 2, y + 35, { align: 'center' });

  // Píldora de equivalencia
  const botellas = Math.round(ultimoResultado.totalGeneral / 5);
  doc.setFillColor(224, 247, 250); // Cyan muy suave
  doc.roundedRect(PW/2 - 40, y + 40, 80, 6, 3, 3, 'F');
  doc.setTextColor(0, 131, 143);
  doc.setFontSize(8);
  doc.text(`Equivale a ${botellas.toLocaleString('es-MX')} botellas de 5L`, PW / 2, y + 44.2, { align: 'center' });

  y += cardH + 15;

  // ── Desglose (Estilo barras de progreso modernas) ──
  doc.setTextColor(...C_DARK);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Desglose por Categoría', MARGIN, y);
  y += 10;

  const colores = [
    [14, 165, 233], [16, 185, 129], [139, 92, 246], 
    [245, 158, 11], [236, 72, 153], [249, 115, 22], [99, 102, 241]
  ];

  ultimoResultado.categorias.forEach((cat, i) => {
    const pct = ultimoResultado.totalGeneral > 0 ? Math.round((cat.litros / ultimoResultado.totalGeneral) * 100) : 0;
    const color = colores[i] || C_PRIMARY;

    // Textos
    doc.setTextColor(...C_DARK);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(cat.nombre, MARGIN, y + 4);

    doc.setTextColor(...C_TEXT);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`${cat.litros.toLocaleString('es-MX')} L`, PW - MARGIN - 14, y + 4, { align: 'right' });

    doc.setTextColor(...C_PRIMARY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${pct}%`, PW - MARGIN, y + 4, { align: 'right' });

    // Barras más delgadas y finas
    const barLeft = MARGIN + 45;
    const barW = PW - MARGIN * 2 - 70;
    const fillW = Math.max((pct / 100) * barW, 1);

    doc.setFillColor(...C_BORDER);
    doc.roundedRect(barLeft, y + 1.8, barW, 2.5, 1.2, 1.2, 'F');
    doc.setFillColor(...color);
    doc.roundedRect(barLeft, y + 1.8, fillW, 2.5, 1.2, 1.2, 'F');

    // Línea separadora sutil
    doc.setDrawColor(...C_BORDER);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y + 9, PW - MARGIN, y + 9);

    y += 13;
  });


  // =======================================================
  // PÁGINA 2: CONFIGURACIÓN Y CONSEJOS
  // =======================================================
  doc.addPage();
  drawHeader('Detalles y Recomendaciones');
  y = MARGIN + 35;

  doc.setTextColor(...C_DARK);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Valores Configurados', MARGIN, y);
  y += 8;

  const cfg = ultimaConfig;
  const configuracion = [
    ['Ducha diaria',             `${cfg.minDucha} minutos`],
    ['Cierra llave (ducha)',      cfg.cierraLlave      ? 'Sí' : 'No'],
    ['Cierra llave (cepillado)',  cfg.cierraCepillo    ? 'Sí' : 'No'],
    ['Sistema inodoro',           cfg.inodoroDual      ? 'Dual (4.5 L)' : 'Normal (12 L)'],
    ['Cierra llave (manos)',      cfg.cierraManos      ? 'Sí' : 'No'],
    ['Afeitado',                  cfg.usaRecipiente    ? 'Con recipiente' : 'Llave abierta'],
    ['Lavado de platos',          cfg.reutilizaPlatos  ? 'Reutiliza agua' : 'Sin grifo abierto'],
    ['Lavado de ropa',            `${cfg.vecesRopa} veces/semana`],
    ['Carga de ropa',             cfg.cargaCompleta    ? 'Completa' : 'Incompleta'],
    ['Lavado de auto',            cfg.usaCubeta        ? 'Cubeta (50 L)' : 'Manguera (400 L)'],
    ['Riego de jardín',           `${cfg.minJardin} min/semana`],
  ];

  // Contenedor limpio para la grid
  doc.setFillColor(...C_BG);
  doc.roundedRect(MARGIN, y, PW - MARGIN * 2, 85, 3, 3, 'F');
  doc.setDrawColor(...C_BORDER);
  doc.roundedRect(MARGIN, y, PW - MARGIN * 2, 85, 3, 3, 'S');

  y += 8;
  const colW = (PW - MARGIN * 2 - 20) / 2;

  configuracion.forEach((fila, i) => {
    const col  = i % 2;
    const row  = Math.floor(i / 2);
    const xPos = MARGIN + 8 + col * (colW + 10);
    const yPos = y + row * 12;

    // Etiqueta
    doc.setTextColor(...C_TEXT);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(fila[0] + ':', xPos, yPos);

    // Valor (alineado a la derecha de su columna)
    doc.setTextColor(...C_DARK);
    doc.setFont('helvetica', 'bold');
    doc.text(fila[1], xPos + colW - 10, yPos, { align: 'right' });

    // Línea punteada/suave entre filas
    if (col === 1 && i < configuracion.length - 2) {
        doc.setDrawColor(...C_BORDER);
        doc.setLineWidth(0.2);
        doc.line(MARGIN + 8, yPos + 5, PW - MARGIN - 8, yPos + 5);
    }
  });

  y += 88; // Saltamos la caja de configuración

  // ── Consejos Personalizados ──
  const mayor = ultimoResultado.categorias.reduce((max, cat) => cat.litros > max.litros ? cat : max, ultimoResultado.categorias[0]);
  const consejosData = CONSEJOS[mayor.nombre];

  if (consejosData) {
    doc.setTextColor(...C_PRIMARY);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`Consejos: ${mayor.nombre}`, MARGIN, y);
    
    doc.setTextColor(...C_MUTED);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Tu área de mayor oportunidad de ahorro', MARGIN, y + 5);
    y += 12;

    consejosData.tips.forEach((tip, i) => {
      const textoLimpio = tip.replace(/<[^>]*>/g, '');
      const lineas      = doc.splitTextToSize(`${textoLimpio}`, PW - MARGIN * 2 - 10);
      const alturaFila  = lineas.length * 5;

      // Check si el texto se va a salir de la página
      if (y + alturaFila > PH - 25) { 
          doc.addPage(); 
          drawHeader('Recomendaciones (Continuación)'); 
          y = MARGIN + 35; 
      }

      // Viñeta estilo "dot" cyan
      doc.setFillColor(...C_PRIMARY);
      doc.circle(MARGIN + 2, y + 3.5, 1.5, 'F');

      doc.setTextColor(...C_TEXT);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(lineas, MARGIN + 7, y + 4.5);

      y += alturaFila + 6;
    });
  }

  // =======================================================
  // FOOTER GLOBAL (Se aplica a todas las páginas)
  // =======================================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    
    // Franja inferior
    doc.setFillColor(...C_BG);
    doc.rect(0, PH - 14, PW, 14, 'F');
    doc.setDrawColor(...C_BORDER);
    doc.setLineWidth(0.3);
    doc.line(0, PH - 14, PW, PH - 14);

    doc.setTextColor(...C_MUTED);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('AguaVida — Educando para un futuro sostenible', MARGIN, PH - 6);
    doc.text(`Página ${p} de ${totalPages}`, PW - MARGIN, PH - 6, { align: 'right' });
  }

  doc.save('informe-aguavida.pdf');
}

// -------------------------------------------------------
// BOTÓN "Descargar PDF"
// -------------------------------------------------------
const btnDescargar = document.querySelector('.btn-download');
btnDescargar?.addEventListener('click', generarPDF);

// -------------------------------------------------------
// INICIALIZAR MODAL AL CARGAR LA PÁGINA
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', crearModal);