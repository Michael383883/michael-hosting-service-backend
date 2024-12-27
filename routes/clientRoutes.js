// routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const db = require('../config/database');


console.log(clientController);
// Ruta para crear un cliente
router.post('/clients', clientController.createClient);
// Rutas para sitios
router.post('/sites', clientController.createSite); // Agregar sitio
router.put('/sites/:id', clientController.updateSite); // Editar sitio
router.delete('/sites/:id', clientController.deleteSite); // Eliminar sitio



// Rutas adicionales si las necesitas en el futuro
// Ejemplo: Ruta para obtener todos los clientes (GET)
router.get('/clients', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM clients');
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No clients found' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        res.status(500).json({ message: 'Error al obtener los clientes', error: error.message });
    }
});

// Ejemplo: Ruta para obtener un cliente por su ID (GET)
router.get('/clients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM clients WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente', error });
    }
});


router.delete('/clients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar si el cliente existe
        const result = await db.query('SELECT * FROM clients WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Eliminar el cliente
        await db.query('DELETE FROM clients WHERE id = $1', [id]);
        res.status(200).json({ message: 'Cliente eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
    }
});


// Ejemplo: Ruta para obtener un cliente por su ID (GET)
router.get('/clients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM clients WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente', error });
    }
});


module.exports = router