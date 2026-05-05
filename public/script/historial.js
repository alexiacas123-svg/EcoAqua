// =================================================================
// 1. INICIALIZACIÓN DEL GRÁFICO DEL DASHBOARD
// =================================================================
let miGrafico;
let historialGlobal = []; // Guardaremos la info de AWS aquí para que los botones la puedan usar

// Función para obtener los últimos 7 días reales (Ej: Dom, Lun, Mar...)
function obtenerUltimos7Dias() {
    const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const etiquetas = [];
    for (let i = 6; i >= 0; i--) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - i);
        etiquetas.push(nombresDias[fecha.getDay()]);
    }
    return etiquetas;
}

document.addEventListener('DOMContentLoaded', function() {
    const chartCanvas = document.getElementById('consumptionChart');
    
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

        miGrafico = new Chart(ctx, {
            type: 'line',
            data: {
                labels: obtenerUltimos7Dias(),
                datasets: [{
                    label: 'Consumo Diario (L)',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#06b6d4',
                    borderWidth: 4,
                    fill: true,
                    backgroundColor: gradient,
                    tension: 0.4,
                    pointRadius: 5,            
                    pointBackgroundColor: '#06b6d4', 
                    pointBorderColor: '#06b6d4',     
                    pointBorderWidth: 2,       
                    pointHoverRadius: 7,
                    pointHoverBorderWidth: 3,
                    pointHoverBackgroundColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#fff',
                        titleColor: '#0f172a',
                        bodyColor: '#64748b',
                        padding: 12,
                        cornerRadius: 16,
                        borderColor: '#f1f5f9',
                        borderWidth: 1,
                        displayColors: false,
                        titleFont: { weight: 'bold' }
                    }
                },
                scales: {
                    y: { 
                        display: true, 
                        beginAtZero: true,
                        grid: { 
                            color: '#f1f5f9', 
                            drawBorder: false // Esto mantiene tus líneas horizontales sutiles
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { weight: '600', size: 10 },
                            callback: function(value) {
                                if (value >= 1000) return (value / 1000).toFixed(1) + 'K L';
                                return value + ' L';
                            }
                        }
                    },
                    x: {
                        grid: { 
                            display: false, 
                            drawOnChartArea: false, // ¡ESTA ES LA MAGIA QUE BORRA LAS VERTICALES!
                            drawTicks: false
                        },
                        border: { display: false },
                        ticks: { color: '#94a3b8', font: { weight: '600', size: 11 }, padding: 10 }
                    }
                }
            }
        });
    }

    // Activar el filtro de 7 días / 30 días
    const selectorFiltro = document.querySelector('.chart-section select');
    if (selectorFiltro) {
        selectorFiltro.addEventListener('change', (e) => {
            cargarHistorialAWS(e.target.value);
        });
    }

    // Activar botones superiores de Semana
    const btnSemanaAnterior = document.querySelector('.dash-header button:nth-child(1)');
    const btnSemanaActual = document.querySelector('.dash-header button:nth-child(2)');

    if (btnSemanaAnterior && btnSemanaActual) {
        btnSemanaAnterior.addEventListener('click', () => {
            btnSemanaAnterior.classList.replace('dash-btn-outline', 'dash-btn-primary');
            btnSemanaActual.classList.replace('dash-btn-primary', 'dash-btn-outline');
            actualizarTarjetasKPI(historialGlobal, false); // false = Carga la semana pasada
        });
        
        btnSemanaActual.addEventListener('click', () => {
            btnSemanaActual.classList.replace('dash-btn-outline', 'dash-btn-primary');
            btnSemanaAnterior.classList.replace('dash-btn-primary', 'dash-btn-outline');
            actualizarTarjetasKPI(historialGlobal, true); // true = Carga esta semana
        });
    }

    // Cargar historial inicial (por defecto en 7 días)
    setTimeout(() => cargarHistorialAWS('Últimos 7 días'), 500);
});

// =================================================================
// 2. ACTUALIZAR BARRAS DE CATEGORÍA
// =================================================================
window.actualizarDashboard = function(resultado) {
    const totalMensual = resultado.totalGeneral;

    const categoryList = document.querySelector('.category-list');
    if (categoryList) {
        categoryList.innerHTML = ''; 
        const categoriasOrdenadas = [...resultado.categorias].sort((a,b) => b.litros - a.litros);
        
        const iconMap = {
            'Ducha': 'shower-head', 'Lava Manos': 'hand-metal', 'Jardín': 'tree-pine',
            'Auto': 'car', 'Ropa': 'shirt', 'Lavado de Platos': 'utensils', 'Sanitarios': 'toilet'
        };

        categoriasOrdenadas.forEach(cat => {
            const litrosSemanales = cat.litros / 4.3;
            const pct = totalMensual > 0 ? (cat.litros / totalMensual) * 100 : 0;
            const iconName = iconMap[cat.nombre] || 'droplet';

            categoryList.innerHTML += `
                <div class="category-item">
                    <div class="cat-info">
                        <div class="cat-label">
                            <span class="cat-icon"><i data-lucide="${iconName}" size="14"></i></span> ${cat.nombre}
                        </div>
                        <span>${Math.round(litrosSemanales).toLocaleString('es-MX')} L</span>
                    </div>
                    <div class="dash-progress-container"><div class="dash-progress-fill" style="width: ${Math.max(pct, 1)}%; background: var(--dash-primary)"></div></div>
                </div>
            `;
        });
        if(window.lucide) lucide.createIcons();
    }

    const tipText = document.querySelector('.tip-card .tip-content p');
    if(tipText && resultado.categorias.length > 0) {
        const mayorCat = [...resultado.categorias].sort((a,b) => b.litros - a.litros)[0];
        tipText.innerHTML = `Tu mayor área de oportunidad está en <b>${mayorCat.nombre}</b>. ¡Revisa los consejos generados en tu reporte para reducir tu huella hoy mismo!`;
    }
    
    // Le avisamos a la gráfica que busque los nuevos datos, respetando el filtro actual
   const filtroActual = document.querySelector('.chart-section select')?.value || 'Últimos 7 días';
    cargarHistorialAWS(filtroActual);
};
// =================================================================
// 3. CARGAR HISTORIAL REAL DESDE AWS (MAPEO EXACTO POR FECHAS)
// =================================================================
async function cargarHistorialAWS(rango = 'Últimos 7 días') {
    const usuarioGuardado = localStorage.getItem("usuarioEcoAqua");
    if (!usuarioGuardado) return; 

    const usuario = JSON.parse(usuarioGuardado);

    try {
        const urlAntiCache = `/api/historial/${usuario.googleId}?t=${new Date().getTime()}`;
        const respuesta = await fetch(urlAntiCache, { headers: { 'Cache-Control': 'no-cache' } });
        const historialCrudo = await respuesta.json();

        // EL BLINDAJE DEFINITIVO: Convertimos el formato SQL a un Objeto de Fecha Real
        const historial = historialCrudo.map(registro => {
            // Tu base de datos arroja: "2026-05-05 01:46:11.310"
            let fechaSql = registro.FechaRegistro;
            
            // Reemplazamos el espacio por una 'T' y le agregamos la 'Z' de UTC
            if (fechaSql.includes(' ')) fechaSql = fechaSql.replace(' ', 'T');
            if (!fechaSql.includes('Z')) fechaSql += 'Z';
            
            // Al crear el new Date(), el navegador de tu computadora le resta las 6 horas automáticamente
            return { ...registro, FechaObj: new Date(fechaSql) };
        }).sort((a, b) => a.FechaObj.getTime() - b.FechaObj.getTime());

        historialGlobal = historial; 
        actualizarTarjetasKPI(historial, true); 

        if (historial.length > 0 && miGrafico) {
            const hoy = new Date();
            hoy.setHours(23, 59, 59, 999);

            if (rango === 'Últimos 7 días') {
                let consumosDiarios = [0, 0, 0, 0, 0, 0, 0];

                historial.forEach(registro => {
                    let diasAtras = Math.floor((hoy.getTime() - registro.FechaObj.getTime()) / (1000 * 3600 * 24));
                    if (diasAtras < 0) diasAtras = 0; 

                    if (diasAtras >= 0 && diasAtras <= 6) {
                        consumosDiarios[6 - diasAtras] = Math.round(registro.TotalLitros / 7);
                    }
                });
                
                miGrafico.data.labels = obtenerUltimos7Dias();
                miGrafico.data.datasets[0].data = consumosDiarios;
                miGrafico.data.datasets[0].label = 'Consumo Diario (L)'; 
            } else {
                let consumosSemanales = [0, 0, 0, 0];
                
                historial.forEach(registro => {
                    let diasAtras = Math.floor((hoy.getTime() - registro.FechaObj.getTime()) / (1000 * 3600 * 24));
                    if (diasAtras < 0) diasAtras = 0;
                    
                    if (diasAtras >= 0 && diasAtras < 28) {
                        const semanaAtras = Math.floor(diasAtras / 7);
                        consumosSemanales[3 - semanaAtras] = Math.round(registro.TotalLitros);
                    }
                });
                
                miGrafico.data.labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Esta Semana'];
                miGrafico.data.datasets[0].data = consumosSemanales;
                miGrafico.data.datasets[0].label = 'Consumo Semanal (L)';
            }
            
            const maxValor = Math.max(...miGrafico.data.datasets[0].data);
            miGrafico.options.scales.y.max = maxValor > 0 ? Math.ceil(maxValor * 1.2) : 100; 
            miGrafico.update();
        }
    } catch (error) {
        console.error("Error al cargar la gráfica desde AWS:", error);
    }
}

// =================================================================
// 4. ACTUALIZAR LAS 3 TARJETAS PRINCIPALES (KPIs) CON DATOS REALES
// =================================================================
function actualizarTarjetasKPI(historial, mostrarSemanaActual = true) {
    if (!historial || historial.length === 0) return;

    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);

    // 1. Encontrar el registro más reciente (Semana Actual)
    const idxActual = historial.length - 1;
    const registroActual = historial[idxActual];

    // 2. Buscar inteligentemente un registro que sea de hace 7 días o más
    let idxAnterior = 0; // Si la cuenta es muy nueva, por defecto agarra el más viejo de todos
    for (let i = historial.length - 1; i >= 0; i--) {
        const diasAtras = Math.floor((hoy.getTime() - historial[i].FechaObj.getTime()) / (1000 * 3600 * 24));
        if (diasAtras >= 7) {
            idxAnterior = i;
            break; // ¡Encontramos el registro de la semana pasada! Detenemos la búsqueda.
        }
    }
    
    const registroAnterior = historial[idxAnterior];

    // 3. ¿Qué botón presionó el usuario?
    const registroMostrar = mostrarSemanaActual ? registroActual : registroAnterior;
    
    // La matemática de la flecha roja/verde (Tendencia)
    const registroComparar = mostrarSemanaActual ? registroAnterior : historial[0];

    const totalSemana = registroMostrar.TotalLitros;
    const promedioDiario = totalSemana / 7;
    const botellas = totalSemana / 5;

    // --- 1. TARJETA: CONSUMO ESTA SEMANA ---
    document.querySelector('.kpi-grid .dash-card:nth-child(1) .val').innerHTML = 
        `${Math.round(totalSemana).toLocaleString('es-MX')} <span class="unit">L</span>`;

    const tendenciaBadge = document.querySelector('.kpi-grid .dash-card:nth-child(1) .trend-badge');
    if (tendenciaBadge) {
        // Mostrar tendencia solo si hay más de 1 cálculo y no estamos comparando el mismo con el mismo
        if (historial.length > 1 && registroMostrar !== registroComparar) {
            tendenciaBadge.style.display = 'inline-flex';
            const diferencia = totalSemana - registroComparar.TotalLitros;
            const porcentaje = registroComparar.TotalLitros > 0 ? Math.round((diferencia / registroComparar.TotalLitros) * 100) : 0;

            if (porcentaje <= 0) {
                tendenciaBadge.innerHTML = `<i data-lucide="trending-down" size="14"></i> ${porcentaje}% vs anterior`;
                tendenciaBadge.style.color = '#10b981'; 
                tendenciaBadge.style.backgroundColor = '#d1fae5';
            } else {
                tendenciaBadge.innerHTML = `<i data-lucide="trending-up" size="14"></i> +${porcentaje}% vs anterior`;
                tendenciaBadge.style.color = '#ef4444'; 
                tendenciaBadge.style.backgroundColor = '#fee2e2';
            }
        } else {
            tendenciaBadge.style.display = 'none'; 
        }
    }

    // Fecha dinámica usando el Objeto Date real
    const fechaDiv = document.querySelector('.kpi-grid .dash-card:nth-child(1) div:last-child');
    if (fechaDiv) {
        const opciones = { month: 'short', day: 'numeric' };
        const textoFecha = registroMostrar.FechaObj.toLocaleDateString('es-MX', opciones).toUpperCase();
        const hoyTexto = new Date().toLocaleDateString('es-MX', opciones).toUpperCase();
        
        if (mostrarSemanaActual) {
            if (textoFecha === hoyTexto) {
                fechaDiv.innerText = `ACTUALIZADO HOY, ${textoFecha}`;
            } else {
                fechaDiv.innerText = `ÚLTIMO REGISTRO: ${textoFecha}`;
            }
        } else {
            // Le indicamos visualmente que es un registro de hace tiempo
            fechaDiv.innerText = `REGISTRO DE HACE 7+ DÍAS (${textoFecha})`;
        }
    }

    // --- 2. TARJETA: PROMEDIO DIARIO ---
    const tarjeta2 = document.querySelector('.kpi-grid .dash-card:nth-child(2)');
    if (tarjeta2) {
        tarjeta2.querySelector('.val').innerHTML = 
            `${Math.round(promedioDiario).toLocaleString('es-MX')} <span class="unit">L</span>`;

        const eficienciaTag = document.querySelector('.efficiency-tag');
        if (eficienciaTag) {
            if (promedioDiario <= 1500) {
                eficienciaTag.innerHTML = `<span style="width: 8px; height: 8px; background: #1ebcc1; border-radius: 50%; display:inline-block; margin-right:4px;"></span> Eficiencia: Excelente`;
                eficienciaTag.style.backgroundColor = '#dcfafa'; 
                eficienciaTag.style.color = '#45d2d6'; 
            } else if (promedioDiario <= 2500) {
                eficienciaTag.innerHTML = `<span style="width: 8px; height: 8px; background: #06b6d4; border-radius: 50%; display:inline-block; margin-right:4px;"></span> Eficiencia: Óptima`;
                eficienciaTag.style.backgroundColor = '#cffafe'; 
                eficienciaTag.style.color = '#0891b2'; 
            } else {
                eficienciaTag.innerHTML = `<span style="width: 8px; height: 8px; background: #ef4444; border-radius: 50%; display:inline-block; margin-right:4px;"></span> Eficiencia: A mejorar`;
                eficienciaTag.style.backgroundColor = '#fee2e2'; 
                eficienciaTag.style.color = '#ef4444'; 
            }
        }

        const elementosTexto = tarjeta2.querySelectorAll('*');
        elementosTexto.forEach(elemento => {
            if (elemento.children.length === 0 && elemento.textContent.toUpperCase().includes('BASADO EN ACTIVIDAD')) {
                const diasUnicos = new Set(historial.map(r => r.FechaObj.toDateString())).size;
                const textoDias = diasUnicos === 1 ? '1 DÍA' : `${diasUnicos} DÍAS`;
                elemento.textContent = `BASADO EN ACTIVIDAD DE ${textoDias}`;
            }
        });
    }

    // --- 3. TARJETA: EQUIVALENCIA ---
    document.querySelector('.kpi-grid .dash-card:nth-child(3) .val').innerHTML = 
        `${Math.round(botellas).toLocaleString('es-MX')} <span class="unit"></span>`;

    if (window.lucide) lucide.createIcons();
}

