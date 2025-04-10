const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/registeredUsers.json');
module.exports = {
  name: 'groq',
  description: 'Access the Groq No Limit AI Model (only for registered users)',
  premium: false,
  async execute(client, message, args) {
    const userId = message.author.id;

    let data;
    try {
      const fileData = fs.readFileSync(dataPath, 'utf8');
      data = JSON.parse(fileData);
    } catch (err) {
      console.error('Error reading registeredUsers.json:', err);
      return message.reply('There was an error verifying your access to the Groq model.');
    }

    if (!data.users.includes(userId)) {
      return message.reply('You are not registered to access the Groq No Limit AI Model. Use @register to register.');
    }

    const query = args.join(' ');
    if (!query) {
      return message.reply('Please provide a query for the Groq model.');
    }

    const simulatedResponse = `You asked: "${query}". Here is the simulated response from the Groq No Limit AI Model.`;

    return message.reply(simulatedResponse);
  },
};
