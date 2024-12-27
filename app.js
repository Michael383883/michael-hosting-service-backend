// app.js
const express = require('express');
const app = express();
const clientRoutes = require('./routes/clientRoutes');
require('dotenv').config();
const cors = require('cors');
const db = require('./config/database');
// Conectar a la base de datos
db.connect()
    .then(() => console.log('Base de datos conectada'))
    .catch((err) => console.error('Error al conectar a la base de datos:', err));
// Middleware
app.use(express.json());
app.use(cors());
// Rutas
app.use('/api', clientRoutes);
// Inicio del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});
module.exports = app;