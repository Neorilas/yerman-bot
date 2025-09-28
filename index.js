require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require('discord.js');
const { verifyCodeAndAssignRole } = require('./utils/discord-utils');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);

  // Registro del comando /verify en el servidor
  const commands = [
    new SlashCommandBuilder()
      .setName('verify')
      .setDescription('Verifica tu código y recibe un rol.')
      .addStringOption(option =>
        option
          .setName('code')
          .setDescription('El código de verificación')
          .setRequired(true)
      )
      .toJSON(),
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    // ⚠️ Si quieres registrarlo global, cambia process.env.GUILD_ID por null y usa Routes.applicationCommands
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Comando /verify registrado correctamente');
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }
});

// Manejo de interacciones (slash commands)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'verify') {
    const code = interaction.options.getString('code');

    try {
      const result = await verifyCodeAndAssignRole(code, interaction.member);
      if (result.success) {
        await interaction.reply({ 
          content: `✅ Código válido. Rol asignado: ${result.roleName}`, 
          ephemeral: true 
        });
      } else {
        await interaction.reply({ 
          content: '❌ Código no válido o ya usado.', 
          ephemeral: true 
        });
      }
    } catch (err) {
      console.error('Error verificando código:', err);
      await interaction.reply({ 
        content: '⚠️ Hubo un error al verificar el código.', 
        ephemeral: true 
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
