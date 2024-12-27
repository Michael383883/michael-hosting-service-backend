const db = require('../config/database');
const { exec } = require('child_process');
const fs = require('fs');
const { createClientFolder, createFtpAccount, createDatabaseUser, setDiskQuota } = require('../utils/clientUtils');


// Mantén todas tus funciones helper (createClientFolder, createFtpAccount) igual...

// Función para crear un cliente
async function createClient(req, res) {
    const {
        username,
        site,
        ftp_user,
        ftp_password,
        db_user,
        db_password,
        db_name,
        quota
    } = req.body;

    try {
        // Crear carpeta del cliente


        console.log("sitioooo", site);
        await createClientFolder(site);

        // Crear cuenta FTP con los datos proporcionados
        await createFtpAccount(ftp_user, ftp_password); // Usar ftp_user y ftp_password

        // Crear usuario y base de datos
        await createDatabaseUser(db_user, db_name, db_password);

        // Configurar cuota de disco
        await setDiskQuota(username, quota);

        // Guardar cliente en la base de datos
        const result = await db.query(
            `INSERT INTO clients (username, site, ftp_user, ftp_password, db_user, db_password, db_name, quota) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [username, site, ftp_user, ftp_password, db_user, db_password, db_name, quota]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ message: 'Error al crear cliente', error });
    }
}

// Función para crear un nuevo sitio
async function createSite(req, res) {
    const { username, site, quota } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO clients (username, site, quota) VALUES ($1, $2, $3) RETURNING *',
            [username, site, quota]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating site', error });
    }
}

// Función para editar un sitio
async function updateSite(req, res) {
    const { id } = req.params;
    const { site, quota } = req.body;
    try {
        const result = await db.query(
            'UPDATE clients SET site = $1, quota = $2 WHERE id = $3 RETURNING *',
            [site, quota, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Site not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating site', error });
    }
}

// Función para eliminar un sitio
async function deleteSite(req, res) {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Site not found' });
        }
        res.status(200).json({ message: 'Site deleted successfully', deletedSite: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting site', error });
    }
}

// Exportar todas las funciones en un solo objeto
module.exports = {
    createClient,
    createSite,
    updateSite,
    deleteSite
};
