const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/registeredUsers.json');
const MessageLimit = require('../../models/MessageLimit');

const NON_PREMIUM_LIMIT = 50;
const PREMIUM_LIMIT = 15;

module.exports = {
  name: 'messagelimits',
  description: 'Check how many messages you have left',
  premium: false,
  async execute(client, message, args, userStatus) {
    const userId = message.author.id;

    let userLimits = await MessageLimit.findOne({ userId });
 
    const nonPremiumUsed = Array.from(userLimits.nonPremium.values()).reduce((sum, count) => sum + count, 0);
    const nonPremiumLeft = NON_PREMIUM_LIMIT - nonPremiumUsed;

    const premiumUsed = Array.from(userLimits.premium.values()).reduce((sum, count) => sum + count, 0);
    const premiumLeft = PREMIUM_LIMIT - premiumUsed;

    return message.reply(
      `Here are your remaining message limits:\n` +
      `- Non-Premium Commands: ${nonPremiumLeft} messages left (out of ${NON_PREMIUM_LIMIT})\n` +
      `- Premium Commands: ${premiumLeft} messages left (out of ${PREMIUM_LIMIT})`
  
    let data;
    try {
      const fileData = fs.readFileSync(dataPath, 'utf8');
      data = JSON.parse(fileData);
    } catch (err) {
      console.error('Error reading registeredUsers.json:', err);
      return message.reply('There was an error verifying your access to the Groq model.');
    }

    // Check if the user is registered
    if (!data.users.includes(userId)) {
      return message.reply('You are not registered to access the Groq No Limit AI Model. Use @register to register.');
    }

    // User is registered, proceed with the Groq model logic
    const query = args.join(' ');
    if (!query) {
      return message.reply('Please provide a query for the Groq model.');
    }

  
    const simulatedResponse = `You asked: "${query}". Here is the simulated response from the Groq No Limit AI Model.`;

    return message.reply(simulatedResponse);
    );
  },
};
