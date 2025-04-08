const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/messageLimits.json');
const messageLimits = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const NON_PREMIUM_LIMIT = 50;
const PREMIUM_LIMIT = 15;

function checkMessageLimit(userId, commandName, isPremium, isPremiumCommand) {
  if (!messageLimits[userId]) {
    messageLimits[userId] = {
      nonPremium: {},
      premium: {}
    };
  }

  const userLimits = messageLimits[userId];

  if (isPremiumCommand) {
    if (!userLimits.premium[commandName]) {
      userLimits.premium[commandName] = 0;
    }
    return userLimits.premium[commandName] < PREMIUM_LIMIT;
  } else {
    if (!userLimits.nonPremium[commandName]) {
      userLimits.nonPremium[commandName] = 0;
    }
    return userLimits.nonPremium[commandName] < NON_PREMIUM_LIMIT;
  }
}

function incrementMessageLimit(userId, commandName, isPremiumCommand) {
  const userLimits = messageLimits[userId];

  if (isPremiumCommand) {
    userLimits.premium[commandName]++;
  } else {
    userLimits.nonPremium[commandName]++;
  }

  fs.writeFileSync(dataPath, JSON.stringify(messageLimits, null, 2));
}

function resetMessageLimits() {
  for (const userId in messageLimits) {
    messageLimits[userId].nonPremium = {};
    messageLimits[userId].premium = {};
  }
  fs.writeFileSync(dataPath, JSON.stringify(messageLimits, null, 2));
}

module.exports = {
  checkMessageLimit,
  incrementMessageLimit,
  resetMessageLimits
};