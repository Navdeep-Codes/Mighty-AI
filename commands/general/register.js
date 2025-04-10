const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/registeredUsers.json');

module.exports = {
  name: 'register',
  description: 'Register yourself for access to the Groq model',
  premium: false,
  async execute(client, message, args) {
    const userId = message.author.id;

    let data;
    try {
      const fileData = fs.readFileSync(dataPath, 'utf8');
      data = JSON.parse(fileData);
    } catch (err) {
      console.error('Error reading registeredUsers.json:', err);
      return message.reply('There was an error processing your registration.');
    }

    if (data.users.includes(userId)) {
      return message.reply('You are already registered for CyberCrew Plan');
    }

    data.users.push(userId);

    try {
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      return message.reply('You have been successfully registered for access to the Groq model.');
    } catch (err) {
      console.error('Error writing to registeredUsers.json:', err);
      return message.reply('There was an error saving your registration.');
    }
  },
};
