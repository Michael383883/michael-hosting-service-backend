// Importar la función desde clientUtils.js
const { createClientFolder } = require('./clientUtils');


// Ejecutar la función
(async () => {
    try {
        const clientUsername = 'alcatel.com.bo'; // Cambia esto al nombre del cliente que desees
        const result = await createClientFolder(clientUsername);

        if (result) {
            console.log('Función ejecutada exitosamente.');
        } else {
            console.log('La función no se ejecutó correctamente.');
        }
    } catch (error) {
        console.error('Error al ejecutar la función:', error);
    }
})();
