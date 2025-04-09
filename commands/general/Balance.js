const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/messageLimits.json');

const NON_PREMIUM_LIMIT = 50;
const PREMIUM_LIMIT = 15;

module.exports = {
  name: 'Balance',
  description: 'Check how many messages you have left',
  premium: false,
  async execute(client, message, args, userStatus) {
    const userId = message.author.id;

    let messageLimits;
    try {
      const fileData = fs.readFileSync(dataPath, 'utf8');
      messageLimits = JSON.parse(fileData);
    } catch (err) {
      console.error('Error reading messageLimits.json:', err);
      return message.reply('There was an error retrieving your message limits.');
    }

    const nonPremiumUsed = Object.values(userLimits.nonPremium || {}).reduce((sum, count) => sum + count, 0);
    const nonPremiumLeft = NON_PREMIUM_LIMIT - nonPremiumUsed;

    const premiumUsed = Object.values(userLimits.premium || {}).reduce((sum, count) => sum + count, 0);
    const premiumLeft = PREMIUM_LIMIT - premiumUsed;

    return message.reply(
      `Here are your remaining message limits:\n` +
      `- Non-Premium Commands: ${nonPremiumLeft} messages left (out of ${NON_PREMIUM_LIMIT})\n` +
      `- Premium Commands: ${premiumLeft} messages left (out of ${PREMIUM_LIMIT})`
    );
  },
};
