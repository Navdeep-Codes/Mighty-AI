const fs = require('fs');

const allowedUsers = JSON.parse(fs.readFileSync('./data/allowedUsers.json'));
const premiumUsers = JSON.parse(fs.readFileSync('./data/premiumUsers.json'));

function checkAllowedUser(userId) {
  return allowedUsers.includes(userId);
}

function checkPremiumUser(userId) {
  return premiumUsers.includes(userId);
}

module.exports = { checkAllowedUser, checkPremiumUser };