const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the registered users JSON file
const dataPath = path.join(__dirname, '../../data/registeredUsers.json');

module.exports = {
  name: 'help',
  description: 'Displays the list of commands with emojis and user plan',
  premium: false,
  async execute(client, message, args) {
    const userId = message.author.id;

    // Load the registered users to determine the user's plan
    let isRegistered;
    try {
      const fileData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(fileData);
      isRegistered = data.users.includes(userId);
    } catch (err) {
      console.error('Error reading registeredUsers.json:', err);
      isRegistered = false;
    }

    const userPlan = isRegistered ? 'Free Limited CyberCrew Plan' : 'Not Registered';

    // Commands grouped by premium and non-premium
    const commands = [
      { name: 'help', description: 'Displays this help menu', premium: false },
      { name: 'register', description: 'Register yourself for access to the Groq modell (ONly for Cybercrew members*)', premium: false },
      { name: 'messageLimits', description: 'Check your message limits', premium: false },
      { name: 'groq', description: 'Access the Groq No Limit AI Model', premium: true }
    ];

    // Categorize commands
    const premiumCommands = commands.filter(command => command.premium);
    const nonPremiumCommands = commands.filter(command => !command.premium);

    // Create pages for the embed
    const pages = [
      // Page 1: Non-Premium Commands
      new EmbedBuilder()
        .setTitle('Help Menu - Non-Premium Commands')
        .setDescription('Here is the list of **non-premium** commands:')
        .addFields(
          ...nonPremiumCommands.map(cmd => ({
            name: `🆓 ${cmd.name}`,
            value: cmd.description
          }))
        )
        .setFooter({ text: `Your Plan: ${userPlan}` })
        .setColor('#00FF00'),

      // Page 2: Premium Commands
      new EmbedBuilder()
        .setTitle('Help Menu - Premium Commands')
        .setDescription('Here is the list of **premium** commands:')
        .addFields(
          ...premiumCommands.map(cmd => ({
            name: `🌟 ${cmd.name}`,
            value: cmd.description
          }))
        )
        .setFooter({ text: `Your Plan: ${userPlan}` })
        .setColor('#FFD700')
    ];

    // Pagination buttons
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('⬅️ Previous')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡️ Next')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('close')
        .setLabel('❌ Close')
        .setStyle(ButtonStyle.Danger)
    );

    // Send the first page
    let currentPage = 0;
    const messageReply = await message.reply({
      embeds: [pages[currentPage]],
      components: [buttons]
    });

    // Create a collector for button interactions
    const collector = messageReply.createMessageComponentCollector({
      filter: interaction => interaction.user.id === message.author.id,
      time: 60000 // 1 minute
    });

    collector.on('collect', async interaction => {
      if (interaction.customId === 'previous') {
        // Go to the previous page
        currentPage = currentPage === 0 ? pages.length - 1 : currentPage - 1;
        await interaction.update({ embeds: [pages[currentPage]], components: [buttons] });
      } else if (interaction.customId === 'next') {
        // Go to the next page
        currentPage = (currentPage + 1) % pages.length;
        await interaction.update({ embeds: [pages[currentPage]], components: [buttons] });
      } else if (interaction.customId === 'close') {
        // Close the menu
        await interaction.update({ content: 'Help menu closed.', embeds: [], components: [] });
        collector.stop();
      }
    });

    collector.on('end', () => {
      // Disable buttons after collector ends
      const disabledButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('previous')
          .setLabel('⬅️ Previous')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('➡️ Next')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('close')
          .setLabel('❌ Close')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      );

      messageReply.edit({ components: [disabledButtons] });
    });
  }
};