const { checkAllowedUser, checkPremiumUser } = require('./userManager');
const { checkMessageLimit, incrementMessageLimit } = require('./messageLimitManager');

async function handleCommand(client, message, command, args) {
  const userId = message.author.id;
  console.log(`User ID: ${userId}`); // Debugging statement
  const isAllowed = checkAllowedUser(userId);
  console.log(`Is Allowed User: ${isAllowed}`); // Debugging statement
  const isPremium = checkPremiumUser(userId);
  console.log(`Is Premium User: ${isPremium}`); // Debugging statement

  if (!isAllowed && !isPremium) {
    console.log("User is not allowed"); // Debugging statement
    return message.reply('You are not allowed to use this bot.');
  }

  const isPremiumCommand = command.premium;
  if (isPremiumCommand && !isPremium) {
    console.log("Command is for premium users only"); // Debugging statement
    return message.reply('This command is only available to premium users.');
  }

  if (!checkMessageLimit(userId, command.name, isPremium, isPremiumCommand)) {
    console.log("User has reached message limit"); // Debugging statement
    return message.reply('You have reached your message limit for this command.');
  }

  incrementMessageLimit(userId, command.name, isPremiumCommand);
  try {
    console.log(`Executing command: ${command.name}`); // Debugging statement
    await command.execute(client, message, args, { isAllowed, isPremium });
  } catch (error) {
    console.error("Error executing command:", error);
    message.reply('There was an error executing that command.');
  }
}

module.exports = { handleCommand };