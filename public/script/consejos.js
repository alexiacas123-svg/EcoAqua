// ============================================================
// CONSEJOS — Datos por categoría + Acordeones + Pestañas
// ============================================================

const CATEGORIAS = {
  bano: [
    {
      icono: 'shower-head',
      titulo: 'Duchas de 5 minutos',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 100L' }, { texto: 'TIEMPO: 5 MIN' }],
      contenido: 'Reduce el tiempo bajo la regadera. Instalar un cabezal de bajo flujo puede potenciar este ahorro sin sacrificar la presión de agua que disfrutas.',
      boton: { icono: 'clock', texto: 'Cronometra tu ducha' }
    },
    {
      icono: 'container',
      titulo: 'Cisterna de doble descarga',
      badges: [{ texto: 'NIVEL: MEDIO' }, { texto: 'AHORRO: 60L/DÍA' }],
      contenido: 'Un inodoro de doble descarga usa 4.5L en la descarga corta vs 12L en una cisterna normal. Cambiarlo es la inversión con mayor retorno en ahorro de agua en el baño.',
      boton: { icono: 'info', texto: 'Saber más' }
    },
    {
      icono: 'droplets',
      titulo: 'Cierra la llave al cepillarte',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 35L/DÍA' }],
      contenido: 'Dejar el grifo abierto mientras te cepillas los dientes desperdicia hasta 35 litros al día. Ábrela solo para enjuagarte y notarás la diferencia en tu recibo.',
      boton: { icono: 'check', texto: 'Adoptar hábito' }
    },
    {
      icono: 'wrench',
      titulo: 'Revisa fugas en el baño',
      badges: [{ texto: 'NIVEL: MEDIO' }, { texto: 'AHORRO: 30L/DÍA' }],
      contenido: 'Un grifo que gotea puede desperdiciar hasta 30 litros diarios. Agrega una gota de colorante al tanque del inodoro — si el color aparece en la taza sin jalar, hay fuga.',
      boton: { icono: 'search', texto: 'Detectar fugas' }
    },
  ],

  cocina: [
    {
      icono: 'utensils',
      titulo: 'Lava los platos con cubeta',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 50L/DÍA' }],
      contenido: 'En vez de dejar el grifo abierto mientras lavas, llena una cubeta con agua jabonosa y otra para enjuagar. Puedes reducir el consumo de 80L a solo 15-30L por lavado.',
      boton: { icono: 'droplets', texto: 'Ver técnica' }
    },
    {
      icono: 'refrigerator',
      titulo: 'Descongela sin agua',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 10L/USO' }],
      contenido: 'Evita descongelar alimentos bajo el chorro del grifo. Pásalos al refrigerador la noche anterior o usa el microondas. Ahorras hasta 10 litros cada vez.',
      boton: { icono: 'clock', texto: 'Planear menú' }
    },
    {
      icono: 'recycle',
      titulo: 'Reutiliza el agua de cocción',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 2L/DÍA' }],
      contenido: 'El agua donde herviste verduras o pasta, una vez fría, es perfecta para regar plantas. Está llena de nutrientes y así aprovechas cada litro al máximo.',
      boton: { icono: 'sprout', texto: 'Tips de riego' }
    },
    {
      icono: 'zap',
      titulo: 'Lavavajillas en carga completa',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 20L/CICLO' }],
      contenido: 'Si tienes lavavajillas, úsalo solo cuando esté completamente lleno. Un ciclo completo consume menos agua que lavar a mano con el grifo abierto, pero solo si está lleno.',
      boton: { icono: 'check-circle', texto: 'Checklist' }
    },
  ],

  lavado: [
    {
      icono: 'shirt',
      titulo: 'Lava con carga completa',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 30L/CICLO' }],
      contenido: 'Una lavadora a media carga consume casi la misma agua que una llena. Espera a tener suficiente ropa antes de lavar y reduce el número de ciclos semanales.',
      boton: { icono: 'check', texto: 'Organizar lavado' }
    },
    {
      icono: 'settings',
      titulo: 'Usa el programa ECO',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 40%' }],
      contenido: 'El modo ECO o lavado rápido de tu lavadora puede reducir el consumo de agua hasta un 40%. Úsalo para ropa con suciedad leve o prendas que solo necesitan refrescarse.',
      boton: { icono: 'zap', texto: 'Configurar lavadora' }
    },
    {
      icono: 'recycle',
      titulo: 'Reutiliza el agua del enjuague',
      badges: [{ texto: 'NIVEL: MEDIO' }, { texto: 'AHORRO: 40L/CICLO' }],
      contenido: 'Coloca una cubeta para capturar el agua del enjuague final de la lavadora. Esta agua, aunque jabonosa, sirve perfectamente para limpiar pisos, patios o el baño.',
      boton: { icono: 'droplets', texto: 'Ver cómo' }
    },
    {
      icono: 'wind',
      titulo: 'Lava a mano lo poco sucio',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 80L/CICLO' }],
      contenido: 'Para prendas que solo usaste unas horas y no están realmente sucias, lávalas a mano con una cubeta. Evitas arrancar un ciclo completo de lavadora por 2 o 3 prendas.',
      boton: { icono: 'hand', texto: 'Técnica a mano' }
    },
  ],

  jardin: [
    {
      icono: 'clock',
      titulo: 'Riega temprano o al atardecer',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 30%' }],
      contenido: 'Regar a mediodía puede desperdiciar hasta el 30% del agua por evaporación. Hazlo antes de las 8am o después de las 6pm para que el agua llegue realmente a las raíces.',
      boton: { icono: 'calendar', texto: 'Crear recordatorio' }
    },
    {
      icono: 'cloud-rain',
      titulo: 'Recolecta agua de lluvia',
      badges: [{ texto: 'NIVEL: MEDIO' }, { texto: 'AHORRO: 100%' }],
      contenido: 'Coloca tinacos o cubetas bajo los bajantes del techo para capturar agua de lluvia. Es gratuita, sin cloro y tus plantas la absorben mejor que el agua de la red.',
      boton: { icono: 'info', texto: 'Cómo instalar' }
    },
    {
      icono: 'tree-pine',
      titulo: 'Plantas nativas y resistentes',
      badges: [{ texto: 'NIVEL: MEDIO' }, { texto: 'AHORRO: 50%' }],
      contenido: 'Las plantas nativas de tu región están adaptadas al clima local y requieren mucho menos riego. Sustituir plantas exóticas por nativas puede reducir a la mitad el agua del jardín.',
      boton: { icono: 'sprout', texto: 'Ver especies' }
    },
    {
      icono: 'layers',
      titulo: 'Mulch alrededor de las plantas',
      badges: [{ texto: 'NIVEL: FÁCIL' }, { texto: 'AHORRO: 25%' }],
      contenido: 'Cubrir la tierra alrededor de tus plantas con una capa de mulch (composta, corteza o paja) retiene la humedad y reduce la frecuencia de riego hasta un 25%.',
      boton: { icono: 'leaf', texto: 'Tipos de mulch' }
    },
  ],
};

// -------------------------------------------------------
// RENDERIZAR ACORDEONES
// -------------------------------------------------------
function renderAcordeon(categoria) {
  const contenedor = document.querySelector('.main-content');
  const tituloLine = contenedor.querySelector('.title-with-line');
  const tabs       = contenedor.querySelector('.category-tabs');
  const errors     = contenedor.querySelector('.errors-section');

  // Eliminar acordeones anteriores
  contenedor.querySelectorAll('.action-card').forEach(el => el.remove());

  const items = CATEGORIAS[categoria] || [];

  // Insertar nuevos acordeones antes de errors-section
  items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = `action-card ${i === 0 ? 'expanded' : 'collapsed'}`;
    card.innerHTML = `
      <div class="action-header">
        <div class="action-header-content">
          <div class="action-header-icon">
            <i data-lucide="${item.icono}" size="24"></i>
          </div>
          <div>
            <h3 class="action-title">${item.titulo}</h3>
            <div class="action-badges">
              ${item.badges.map(b => `<span class="action-badge">${b.texto}</span>`).join('')}
            </div>
          </div>
        </div>
        <i data-lucide="${i === 0 ? 'chevron-up' : 'chevron-down'}" size="24" class="chevron-icon"></i>
      </div>
      <div class="action-content" style="${i === 0 ? '' : 'display:none;'}">
        <p>${item.contenido}</p>
        <button class="btn-outline-small">
          <i data-lucide="${item.boton.icono}" size="16"></i> ${item.boton.texto}
        </button>
      </div>
    `;

    // Clic en header para expandir/colapsar
    card.querySelector('.action-header').addEventListener('mouseenter', () => {
      const estaExpandido = card.classList.contains('expanded');

      // Colapsar todos
      contenedor.querySelectorAll('.action-card').forEach(c => {
        c.classList.remove('expanded');
        c.classList.add('collapsed');
        c.querySelector('.action-content').style.display = 'none';
        c.querySelector('.chevron-icon').setAttribute('data-lucide', 'chevron-down');
        lucide.createIcons({ nodes: [c.querySelector('.chevron-icon')] });
      });

      // Expandir el clickeado si estaba colapsado
      if (!estaExpandido) {
        card.classList.remove('collapsed');
        card.classList.add('expanded');
        const content = card.querySelector('.action-content');
content.style.display = 'block';
content.style.animation = 'none';
setTimeout(() => {  
    content.style.animation = 'slideDown 0.6s ease-out';
});
        card.querySelector('.chevron-icon').setAttribute('data-lucide', 'chevron-up');
        lucide.createIcons({ nodes: [card.querySelector('.chevron-icon')] });
      }
    });

    contenedor.insertBefore(card, errors);
  });

  // Re-inicializar iconos Lucide
  if (window.lucide) lucide.createIcons();
}

// -------------------------------------------------------
// LÓGICA DE PESTAÑAS
// -------------------------------------------------------
const mapaPestanas = {
  'Baño':    'bano',
  'Cocina':  'cocina',
  'Lavado':  'lavado',
  'Jardín':  'jardin',
};

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Actualizar estado activo
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Renderizar categoría correspondiente
    const nombreCategoria = btn.textContent.trim();
    const clave = mapaPestanas[nombreCategoria];
    if (clave) renderAcordeon(clave);
  });
});

// -------------------------------------------------------
// INICIALIZAR con Baño al cargar
// -------------------------------------------------------

  document.addEventListener('DOMContentLoaded', () => {
  renderAcordeon('bano');
});

