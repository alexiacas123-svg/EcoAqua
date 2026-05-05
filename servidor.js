const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const nodemailer = require('nodemailer'); 

const app = express();
app.use(express.static('public')); // Magia para mostrar tu HTML
app.use(cors()); 
app.use(express.json()); 

// ==========================================
// 1. CONFIGURACIÓN DE BASE DE DATOS (AWS)
// ==========================================
const config = {
    user: 'admin', 
    password: 'alexia123456', 
    server: 'ecoaqua-db.cuvmiucyo01b.us-east-1.rds.amazonaws.com',
    database: 'EcoAquaDB', 
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }
};

// ==========================================
// 2. CONFIGURACIÓN DEL CARTERO (Nodemailer)
// ==========================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alexia.castro79@unach.mx', 
        pass: 'kdcl hzsj qebz cylp' 
    }
});

// ==========================================
// 3. RUTA 1: INICIAR SESIÓN CON GOOGLE
// ==========================================
app.post('/api/login', async (req, res) => {
    const { googleId, nombre, correo } = req.body;

    try {
        let pool = await sql.connect(config);
        let resultado = await pool.request()
            .input('googleId', sql.VarChar, googleId)
            .query('SELECT * FROM Usuarios WHERE GoogleId = @googleId');

        if (resultado.recordset.length === 0) {
            await pool.request()
                .input('googleId', sql.VarChar, googleId)
                .input('nombre', sql.VarChar, nombre)
                .input('correo', sql.VarChar, correo)
                .query('INSERT INTO Usuarios (GoogleId, Nombre, Correo) VALUES (@googleId, @nombre, @correo)');
            
            console.log(`¡Nuevo usuario registrado!: ${nombre}`);
            res.json({ mensaje: 'Usuario registrado con éxito en SQL Server' });
        } else {
            console.log(`Usuario logueado nuevamente: ${nombre}`);
            res.json({ mensaje: 'Bienvenido de nuevo' });
        }
    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).send('Hubo un error en el servidor');
    }
});

// ==========================================
// 4. RUTA 2: RECIBIR Y ENVIAR COMENTARIOS
// ==========================================
app.post('/api/enviar-comentario', async (req, res) => {
    try {
        const { nombre, correo, mensaje, reaccion } = req.body;

        await sql.connect(config);
        await sql.query`INSERT INTO ReaccionesComentarios (TipoReaccion) VALUES (${reaccion})`;

        const result = await sql.query`
            SELECT 
                COUNT(CASE WHEN TipoReaccion = 'smile' THEN 1 END) as felices,
                COUNT(CASE WHEN TipoReaccion = 'frown' THEN 1 END) as tristes
            FROM ReaccionesComentarios`;

        const opcionesCorreo = {
            from: '"EcoAqua Sistema" <alexia.castro79@unach.mx>',
            to: 'alexia.castro79@unach.mx',
            subject: `Nuevo comentario de ${nombre}`,
            text: `Usuario: ${nombre} (${correo})\nCalificación: ${reaccion}\n\nMensaje:\n${mensaje || 'No escribió mensaje.'}`
        };

        await transporter.sendMail(opcionesCorreo);

        res.json({ 
            felices: result.recordset[0].felices, 
            tristes: result.recordset[0].tristes 
        });

    } catch (error) {
        console.error("Error al procesar el comentario:", error);
        res.status(500).json({ error: "Error en el servidor." });
    }
});

// ==========================================
// 5. RUTA 3: GUARDAR EL CONSUMO EN AWS
// ==========================================
app.post('/api/guardar-consumo', async (req, res) => {
    const { 
        googleId, totalLitros, 
        ducha, manos, jardin, auto, ropa, platos, sanitarios 
    } = req.body;

    try {
        await sql.connect(config);
        
        await sql.query`
            INSERT INTO HistorialConsumo 
            (GoogleId, TotalLitros, LitrosDucha, LitrosManos, LitrosJardin, LitrosAuto, LitrosRopa, LitrosPlatos, LitrosSanitarios) 
            VALUES 
            (${googleId}, ${totalLitros}, ${ducha}, ${manos}, ${jardin}, ${auto}, ${ropa}, ${platos}, ${sanitarios})
        `;
        
        console.log(`¡Consumo detallado guardado para el usuario: ${googleId}!`);
        res.json({ mensaje: "Consumo y categorías guardadas en AWS" });
        
    } catch (error) {
        console.error("Error al guardar en el historial:", error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
});

// ==========================================
// 6. RUTA 4: OBTENER EL HISTORIAL
// ==========================================
app.get('/api/historial/:googleId', async (req, res) => {
    const { googleId } = req.params;

    try {
        await sql.connect(config);
        
        const resultado = await sql.query`
            SELECT TOP 7 * 
            FROM HistorialConsumo 
            WHERE GoogleId = ${googleId} 
            ORDER BY FechaRegistro ASC
        `;
        
        res.json(resultado.recordset);
        
    } catch (error) {
        console.error("Error al obtener el historial:", error);
        res.status(500).json({ error: "Error al consultar la base de datos" });
    }
});

// ==========================================
// 7. PRENDER EL SERVIDOR (Configuración para Render)
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de EcoAqua corriendo en el puerto ${PORT}`);
});