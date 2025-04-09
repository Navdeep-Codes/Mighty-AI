const MessageLimit = require('../models/MessageLimit');

const NON_PREMIUM_LIMIT = 50;
const PREMIUM_LIMIT = 15;

async function checkMessageLimit(userId, commandName, isPremiumCommand) {
  let userLimits = await MessageLimit.findOne({ userId });

  if (!userLimits) {
    userLimits = new MessageLimit({ userId });
    await userLimits.save();
  }

  if (isPremiumCommand) {
    const usedCount = userLimits.premium.get(commandName) || 0;
    return usedCount < PREMIUM_LIMIT;
  } else {
    const usedCount = userLimits.nonPremium.get(commandName) || 0;
    return usedCount < NON_PREMIUM_LIMIT;
  }
}

async function incrementMessageLimit(userId, commandName, isPremiumCommand) {
  let userLimits = await MessageLimit.findOne({ userId });

  if (!userLimits) {
    userLimits = new MessageLimit({ userId });
  }

  if (isPremiumCommand) {
    const usedCount = userLimits.premium.get(commandName) || 0;
    userLimits.premium.set(commandName, usedCount + 1);
  } else {
    const usedCount = userLimits.nonPremium.get(commandName) || 0;
    userLimits.nonPremium.set(commandName, usedCount + 1);
  }

  await userLimits.save();
}

async function resetMessageLimits() {
  const allUsers = await MessageLimit.find();
  for (const user of allUsers) {
    user.nonPremium = {};
    user.premium = {};
    await user.save();
  }
}

module.exports = {
  checkMessageLimit,
  incrementMessageLimit,
  resetMessageLimits
};
