const mysql = require('mysql2/promise');

async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    console.log('Conexión a MySQL establecida.');
    return connection;
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
    throw error;
  }
}

module.exports = {
    connect
}