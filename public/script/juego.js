
        /* =========================================================
           DATOS DEL JUEGO
           ========================================================= */
        let rondas = [
            {palabra:"AHORRO",      descripcion:"Usar solo la cantidad necesaria de agua para no desperdiciarla."},
            {palabra:"CUIDADO",     descripcion:"Acción de proteger y usar el agua de forma responsable."},
            {palabra:"PROTECCION",  descripcion:"Evitar que el agua se contamine o se desperdicie."},
            {palabra:"CONCIENCIA",  descripcion:"Entender la importancia del agua y actuar para cuidarla."},
            {palabra:"RESPONSABILIDAD", descripcion:"Compromiso de cada persona para usar bien el agua."},
            {palabra:"CONSERVACION",descripcion:"Mantener y preservar el agua para el presente y el futuro."},
            {palabra:"RECICLAR",    descripcion:"Procesar el agua para poder usarla nuevamente."},
            {palabra:"LIMPIEZA",    descripcion:"Mantener el agua libre de basura y contaminantes."}
        ];
 
        /* =========================================================
           VARIABLES DE ESTADO
           ========================================================= */
        let palabra;
        let palabraOculta;
        let errores;
        const maxErrores = 5;
        let letrasIntentadas;
        let ronda    = 1;
        let puntaje  = 0;
        let rondaActiva = true;
 
        /* =========================================================
           REFERENCIAS AL DOM  (IDs corregidos)
           ========================================================= */
        const agua           = document.getElementById("agua");          // FIX: era "water-tank"
        const mensaje        = document.getElementById("mensaje");
        const letrasUsadasEl = document.getElementById("letrasUsadas");
        const infoRonda      = document.getElementById("infoRonda");
        const descripcionEl  = document.getElementById("descripcion");
        const carita         = document.getElementById("carita");
        const wordDisplay    = document.getElementById("word-display");
        const nextBtn        = document.getElementById("next-btn");      // FIX: ahora conectado
 
        /* =========================================================
           FUNCIÓN: NUEVA RONDA
           ========================================================= */
        function nuevaRonda() {
            let rondaActual = rondas[ronda - 1];
 
            palabra        = rondaActual.palabra;
            descripcionEl.innerText = rondaActual.descripcion;
 
            palabraOculta     = [];
            errores           = 0;
            letrasIntentadas  = [];
 
            agua.style.height = "100%";
            mensaje.innerText = "Presiona una letra del teclado";
            carita.innerText  = "";
            letrasUsadasEl.innerHTML = "";   // FIX: limpia badges
 
            // Crear casillas dinámicamente
            wordDisplay.innerHTML = "";
            for (let i = 0; i < palabra.length; i++) {
                palabraOculta.push("_");
                let dash = document.createElement("div");
                dash.classList.add("word-dash");
                wordDisplay.appendChild(dash);
            }
 
            infoRonda.innerText = "Ronda: " + ronda + " | Puntaje: " + puntaje;
            rondaActiva = true;
        }
 
        /* =========================================================
           FUNCIÓN: SIGUIENTE RONDA  (llamada por el botón)
           ========================================================= */
        function siguienteRonda() {
            if (!rondaActiva) {
                ronda++;
 
                if (ronda > rondas.length) {
                    // FIX: se eliminó "palabraHTML" que no existía
                    descripcionEl.innerText = "";
                    wordDisplay.innerHTML   = "";
                    mensaje.innerText =
                        "¡FELICIDADES! " +
                        "Terminaste el juego. " +
                        "Puntaje final: " + puntaje + " de " + rondas.length + ". " +
                        "¡CUIDA EL AGUA! Cada gota cuenta.";
                    carita.innerText  = "🏆";
                    rondaActiva = false;
                    return;
                }
 
                nuevaRonda();
            }
        }
 
        /* =========================================================
           EVENTO: TECLA PRESIONADA
           ========================================================= */
        document.addEventListener("keydown", function(event) {
            if (!rondaActiva) return;
 
            let letra = event.key.toUpperCase();
            if (!letra.match(/^[A-Z]$/)) return;
            if (letrasIntentadas.includes(letra)) return;
 
            letrasIntentadas.push(letra);
 
            // FIX: crear badges individuales en vez de texto plano
            letrasUsadasEl.innerHTML = "";
            letrasIntentadas.forEach(function(l) {
                let badge = document.createElement("span");
                badge.classList.add("used-badge");
                badge.innerText = l;
                letrasUsadasEl.appendChild(badge);
            });
 
            // FIX: re-queriar los dashes DESPUÉS de que nuevaRonda los creó
            const dashes = document.querySelectorAll(".word-dash");
 
            if (palabra.includes(letra)) {
                for (let i = 0; i < palabra.length; i++) {
                    if (palabra[i] === letra) {
                        palabraOculta[i] = letra;
                        dashes[i].textContent = letra;
                        dashes[i].classList.add("revealed");
                    }
                }
 
                if (!palabraOculta.includes("_")) {
                    mensaje.innerText = "¡Correcto! Presiona 'Siguiente ronda'";
                    carita.innerText  = "😊";
                    puntaje++;
                    rondaActiva = false;
                }
 
            } else {
                errores++;
                carita.innerText = "😢";
 
                let nivel = 100 - (errores / maxErrores) * 100;
                agua.style.height = nivel + "%";
 
                const msgs = [
                    "",
                    "Un pequeño desperdicio parece insignificante.",
                    "El agua dulce es limitada, cuídala.",
                    "Cada error desperdicia el agua.",
                    "Estamos cerca de agotar el recurso.",
                    "El desperdicio agotó el tanque."
                ];
                mensaje.innerText = msgs[errores] || "";
 
                if (errores === maxErrores) {
                    rondaActiva = false;
                    setTimeout(function() {
                        ronda++;
                        if (ronda <= rondas.length) nuevaRonda();
                    }, 2000);
                }
            }
        });
 
        /* =========================================================
           EVENTO: BOTÓN SIGUIENTE RONDA
           ========================================================= */
        nextBtn.addEventListener("click", siguienteRonda);  // FIX: antes no estaba conectado
 
        /* =========================================================
           FUNCIÓN: SALIR
           ========================================================= */
        function salir() {
            window.location.href = "index.html";
        }
 
    /* =========================================================
           FUNCIÓN: VALIDAR SESIÓN
           ========================================================= */
        function verificarSesion() {
            const usuarioGuardado = localStorage.getItem("usuarioEcoAqua");
            
            if (!usuarioGuardado) {
                alert("¡Hola! Para poder jugar y salvar el tanque de agua, primero debes iniciar sesión.");
                // Asegúrate de que "login.html" sea el nombre correcto de tu página de acceso
                window.location.href = "login.html";
                return false;
            }
            return true;
        }

        /* =========================================================
           INICIO (Protegido por Sesión)
           ========================================================= */
        // Ahora solo inicia si el usuario está logueado
        if (verificarSesion()) {
            nuevaRonda();
        }