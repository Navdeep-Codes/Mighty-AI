const MessageLimit = require('../../models/MessageLimit');

const NON_PREMIUM_LIMIT = 50;
const PREMIUM_LIMIT = 15;

module.exports = {
  name: 'messageLimits',
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
    );
  },
};
