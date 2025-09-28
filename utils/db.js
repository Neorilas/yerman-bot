const { connect } = require('./dbConnection');

async function getCodeFromDB(code) {
  const db = await connect();
  try {
        const [rows] = await db.execute(
        'SELECT codigo FROM venta_code WHERE codigo = ? AND activo = 1 LIMIT 1',
        [code]
    );

    if (rows.length > 0) {
        console.log("Código válido");
        return { used: false, response: "Codigo valido" };
    } else {
        console.log("Código inválido o ya usado");
        return { used: true, response: "Código inválido o ya usado"}
    }

  } catch (error) {
    console.error('Error al recuperar el código:', error);
    await saveError('getCodeFromDB','',code)
    throw error;
  } finally {
    db.end();
  }
}

async function markCodeAsUsed(code) {
  const db = await connect();
  try {
    const [result] = await db.execute(
        `UPDATE venta_code SET activo = ? WHERE codigo = ?`,
        [false, code]
    );

    console.log('✅ Datos insertados:', result);
    return { inserted: true, insertId: result.insertId, response: "Codigo actualizado, ya no puede usarse."};

  } catch (error) {
    console.error('Error al insertar datos:', error);
    console.log('Intentando registrar log de errores');
    await saveError('markCodeAsUsed','', code);
    throw error;
  } finally {
    db.end();
  }
}

async function saveError(typeErr, email, codigo ) {
    const db = await connect();
    try {
        const [result] = await db.execute(
            'INSERT INTO error_log (type, email, codigo, date) VALUES (?, ?, ?, ?)',
            [typeErr, email, codigo, new Date()]
        );
    } catch (error) {
        console.error('Fallo al registrar el log de errores.', error)
        throw error;
    } finally {
        db.end();
    }
}

module.exports = {
    getCodeFromDB,
    markCodeAsUsed
};