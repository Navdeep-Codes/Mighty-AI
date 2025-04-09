require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const cron = require('node-cron');
const { resetMessageLimits } = require('./utils/messageLimitManager');
const Online = require('./online');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
client.aliases = new Collection();

const mongoose = require('mongoose');

(async () => {
  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }

]  fs.readdirSync('./commands/').forEach(dir => {
    const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`./commands/${dir}/${file}`);
      client.commands.set(command.name, command);
      if (command.aliases) {
        command.aliases.forEach(alias => {
          client.aliases.set(alias, command.name);
        });
      }
      console.log(`Loaded command: ${command.name} from ${dir}/${file}`);
    }
  });

  fs.readdirSync('./events/').filter(file => file.endsWith('.js')).forEach(file => {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
    console.log(`Loaded event: ${eventName}`);
  });

  cron.schedule('0 0 * * *', async () => {
    console.log('Resetting message limits');
    await resetMessageLimits();
  });


client.login(process.env.DISCORD_TOKEN);
