require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const cron = require('node-cron');
const { resetMessageLimits } = require('./utils/messageLimitManager');
const Online = require('./Online.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
client.aliases = new Collection();

Online();

// Load Commands
fs.readdirSync('./commands/').forEach(dir => {
  const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${dir}/${file}`);
    client.commands.set(command.name, command);
    if (command.aliases) {
      command.aliases.forEach(alias => {
        client.aliases.set(alias, command.name);
      });
    }
    console.log(`Loaded command: ${command.name} from ${dir}/${file}`); // Debugging statement
  }
});

// Load Events
fs.readdirSync('./events/').filter(file => file.endsWith('.js')).forEach(file => {
  const event = require(`./events/${file}`);
  const eventName = file.split('.')[0];
  client.on(eventName, event.bind(null, client));
  console.log(`Loaded event: ${eventName}`); // Debugging statement
});

// Schedule a daily reset of message limits at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Resetting message limits');
  resetMessageLimits();
});

client.login(process.env.DISCORD_TOKEN);
