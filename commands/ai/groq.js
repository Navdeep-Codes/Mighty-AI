const fs = require('fs');
const path = require('path');
// Default
import Groq from "groq-sdk";

const dataPath = path.join(__dirname, '../../data/registeredUsers.json');
module.exports = {
  name: 'free',
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

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions
    .create({
      messages: [
        {
          role: "user",
          content: "Explain the importance of fast language models",
        },
      ],
      model: "llama-3.1-8b-instant",
    })
    .then((chatCompletion) => {
      return message.reply(chatCompletion.choices[0]?.message?.content || "");
    });

    const simulatedResponse = `You asked: "${query}". Here is the simulated response from the Groq No Limit AI Model.`;

  },
};


