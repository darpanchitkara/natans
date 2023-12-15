import { config } from "dotenv";
config();

import { Configuration, OpenAIApi } from "openai";
import readline from "readline";
import fs from "fs";

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
);

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const themeFile = "email_template.txt"; 

userInterface.question("Enter your company name: ", async (theme) => {
  
  const response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: `You are creating an email template for the given company name: "${theme}"` },
      { role: "user", content: `I will give you a name of a company and you will find a theme or key area of business where it operates. You have to prepare a small email keeping the theme of the business in mind. The email should be sent to the company's employees from the CEO, so the email should be prepared with its respective theme and should be intended for their business and engineering people. The email should have a placeholder for putting a URL for a promotional website, should be a bit more specific, and the content should be between 100-150 words. Also, give 10 suggested domains for the same company name outside of the mail separately. "${theme}" `},
    ],
  });

  const emailTemplate = response.data.choices[0].message.content;
  console.log(`Generated Email Template for the company "${theme}":`);
  console.log(emailTemplate);

  // Write the new output to the file, replacing the old content
  fs.writeFileSync(themeFile, emailTemplate);

  userInterface.close();
});

userInterface.on("close", () => {
  console.log("Email template generation completed.");
  process.exit(0);
});