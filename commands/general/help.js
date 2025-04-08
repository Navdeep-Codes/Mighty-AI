module.exports = {
    name: 'help',
    description: 'List all commands',
    execute(client, message, args) {
      const commands = client.commands.map(cmd => `${cmd.name}: ${cmd.description}`).join('\n');
      message.reply(`Available commands:\n${commands}`);
    }
  };