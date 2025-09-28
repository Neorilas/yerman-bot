const { getCodeFromDB, markCodeAsUsed } = require('./db');

async function verifyCodeAndAssignRole(code, member) {
  const codeData = await getCodeFromDB(code);
  if (!codeData || codeData.used) {
    return { success: false };
  }

  // Aquí eliges el rol (puedes tenerlo en .env o hardcodeado)
  const roleName = 'Alumno'; // Cambia por tu rol
  const role = member.guild.roles.cache.find(r => r.name === roleName);

  if (!role) {
    throw new Error(`Rol ${roleName} no encontrado en el servidor.`);
  }

  await member.roles.add(role);
  await markCodeAsUsed(code);

  return { success: true, roleName };
}

module.exports = { verifyCodeAndAssignRole };
