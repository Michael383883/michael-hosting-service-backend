
const path = require('path');
const { exec } = require('child_process');

// Ruta base para las carpetas de los clientes
const basePath = '/srv/www/';

const fs = require('fs-extra');

/**
 * Promisify exec function for better async/await handling.
 */
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error.message);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(stdout);
        });
    });
}

/**
 * Configura la cuota de disco para un subvolumen en Btrfs.
 * @param {string} subvolumeName - Nombre del subvolumen (cliente).
 * @param {number} quota - Tamaño de la cuota en bloques de 1 KiB.
 */


// Función que envuelve exec en una Promesa
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(stderr); // Devuelve el error si algo sale mal
            } else {
                resolve(stdout); // Devuelve la salida si todo está bien
            }
        });
    });
}

// Función para crear carpeta del cliente y asignar permisos
async function createClientFolder(clientUsername) {
    try {

        const command = `
expect <<'EOF'
spawn su -
expect "Password:"
send "admin\\r"
expect "#"
send "bash ~/scripts/setup_vhost.sh ${clientUsername}\\r"
expect "#"
send "exit\\r"
EOF
`;


        const result = await execPromise(command);
        console.log(`Virtual host configurado para: ${clientUsername}`);
        console.log(result.stdout || result);

        return true;
    } catch (error) {
        console.error('Error al configurar virtual host:', error.stderr || error);
        return false;
    }
}

// Función para crear una cuenta FTP
async function createFtpAccount(username, password) {
    try {
        // Crear el comando para agregar el usuario al sistema con la contraseña en texto claro
        const createUserCommand = `sudo useradd -m -s /bin/bash ${username}`;

        // Ejecutar el comando para crear el usuario
        await execPromise(createUserCommand);
        console.log(`Usuario ${username} creado exitosamente`);

        // Establecer la contraseña para el usuario
        const setPasswordCommand = `echo "${username}:${password}" | sudo chpasswd`;

        // Ejecutar el comando para asignar la contraseña
        await execPromise(setPasswordCommand);
        console.log(`Contraseña establecida para ${username}`);

    } catch (error) {
        console.error('Error al crear la cuenta FTP:', error);
    }
}


async function createDatabaseUser(clientUsername, dbName, dbPassword) {
    const createDbUser = `CREATE USER ${clientUsername} WITH PASSWORD '${dbPassword}';`;
    const createDb = `CREATE DATABASE ${dbName} OWNER ${clientUsername};`;

    try {
        // Ejecuta el comando para crear el usuario con la contraseña en la variable de entorno
        await execPromise(`PGPASSWORD=admin psql -U postgres -c "${createDbUser}"`);
        console.log(`Usuario '${clientUsername}' creado correctamente.`);

        // Ejecuta el comando para crear la base de datos con la contraseña en la variable de entorno
        await execPromise(`PGPASSWORD=admin psql -U postgres -c "${createDb}"`);
        console.log(`Base de datos '${dbName}' creada correctamente para el usuario '${clientUsername}'.`);
    } catch (error) {
        console.error('Error al crear usuario o base de datos:', error);
    }
}


// Función para configurar el firewall
// Función para configurar el firewall con firewalld
async function configureFirewall() {
    try {
        // Permitir conexiones FTP
        await execPromise('sudo firewall-cmd --zone=public --add-port=21/tcp --permanent');
        console.log('Puerto FTP (21) permitido.');

        // Permitir conexiones a PostgreSQL
        await execPromise('sudo firewall-cmd --zone=public --add-port=5432/tcp --permanent');
        console.log('Puerto PostgreSQL (5432) permitido.');

        // Configurar las políticas por defecto
        await execPromise('sudo firewall-cmd --set-default-zone=drop');
        await execPromise('sudo firewall-cmd --reload');
        console.log('Políticas predeterminadas configuradas: todo bloqueado por defecto.');

        // Recargar las reglas
        await execPromise('sudo firewall-cmd --reload');
        console.log('Firewall configurado correctamente.');
    } catch (error) {
        console.error('Error al configurar el firewall:', error);
    }
}


// Función para configurar la cuota de disco
async function setDiskQuota(subvolumeName, quota) {
    const subvolumePath = `/srv/${subvolumeName}`;
    const command = `sudo btrfs qgroup limit ${quota}K ${subvolumePath}`;
    try {
        await execPromise(command);
        console.log(`Cuota de disco configurada para ${subvolumeName}: ${quota} bloques (~${(quota / 1024).toFixed(2)} MiB)`);
    } catch (error) {
        console.error(`Error al configurar la cuota de disco para ${subvolumeName}:`, error);
    }
}


function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error.message);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(stdout);
        });
    });
}

// Exportar todas las funciones para usarlas en otras partes del proyecto
module.exports = {
    createClientFolder,
    createFtpAccount,
    createDatabaseUser,
    configureFirewall,
    setDiskQuota
};
