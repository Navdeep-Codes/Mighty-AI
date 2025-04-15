require('dotenv').config();
const { Client, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');
const ModelClient = require('@azure-rest/ai-inference').default;
const { AzureKeyCredential } = require('@azure/core-auth');
const { isUnexpected } = require('@azure-rest/ai-inference');

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "jais-30b-chat";

module.exports = {
  name: 'arabic',
  description: 'Use Arabic Language AI Model',
  premium: false,
  async execute(client, message, args, userStatus) {
    console.log("freeModel command executed"); // Debugging statement
    const query = args.join(' ');

    // Initialize the Azure AI model client
    const aiClient = ModelClient(
      endpoint,
      new AzureKeyCredential(token),
    );
    

    try {
      // Make a request to the Azure AI model
      const response = await aiClient.path("/chat/completions").post({
        body: {
          messages: [
            { role: "system", content: `You are a helpful assistant.Give short and precise answers. Give long answers only when asked.` },
            { role: "user", content: query }
          ],
          temperature: 1.0,
          top_p: 1.0,
          max_tokens: 1000,
          model: modelName
        }
      });

      if (isUnexpected(response)) {
        throw response.body.error;
      }

      // Send the response from the AI model back to the user
      const aiResponse = response.body.choices[0].message.content;
      message.reply(aiResponse);
      console.log("AI Response:", aiResponse); // Debugging statement

    } catch (err) {
      console.error("Error occurred while fetching AI response:", err);
      message.reply('There was an error processing your request.');
    }
  }
};
