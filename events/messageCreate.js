const config = require('../config.json');
const { handleCommand } = require('../utils/commandHandler');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  const prefix = process.env.PREFIX;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  console.log(`Received command: ${commandName}`); // Debugging statement

  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

  if (!command) {
    console.log(`Command not found: ${commandName}`); // Debugging statement
    return;
  }

  console.log(`Executing command: ${commandName}`); // Debugging statement

  handleCommand(client, message, command, args);
};