// const pool = require('../config/database');
// const Client = {
//     create: async (data) => {
//         const query = 
//             INSERT INTO clients (username, site, ftp_user, ftp_password, db_user, db_password, db_name, quota) 
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
//         const values = [data.username, data.site, data.ftp_user, data.ftp_password, data.db_user, data.db_password, data.db_name, data.quota];
//         const result = await pool.query(query, values);
//         return result.rows[0];
//     },
// };
// module.exports = Client;


const pool = require('../config/database');

const Client = {
    create: async (data) => {
        const query = `
            INSERT INTO clients (username, site, ftp_user, ftp_password, db_user, db_password, db_name, quota) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `;
        const values = [
            data.username,
            data.site,
            data.ftp_user,
            data.ftp_password,
            data.db_user,
            data.db_password,
            data.db_name,
            data.quota
        ];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear cliente:', error);
            throw error;
        }
    },
};

module.exports = Client;
