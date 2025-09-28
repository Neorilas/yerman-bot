require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { verifyCodeAndAssignRole } = require('./utils/discord-utils');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// Escucha mensajes en Discord
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Ejemplo: !verify ABC123
  if (message.content.startsWith('!verify')) {
    const code = message.content.split(' ')[1];

    if (!code) {
      return message.reply('Debes indicar un código. Ejemplo: `!verify TU-CODIGO`');
    }

    try {
      const result = await verifyCodeAndAssignRole(code, message.member);
      if (result.success) {
        message.reply(`✅ Código válido. Rol asignado: ${result.roleName}`);
      } else {
        message.reply('❌ Código no válido o ya usado.');
      }
    } catch (err) {
      console.error('Error verificando código:', err);
      message.reply('⚠️ Hubo un error al verificar el código.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
