require('dotenv').config();

const apiKey = process.env.API_KEY;
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const formData = new FormData();
formData.append(
  "file",
  fs.createReadStream('./BulletinNote (1).pdf')
);

const options = {
  headers: {
    "x-api-key": apiKey,
    ...formData.getHeaders(),
  },
};

axios
  .post("https://api.chatpdf.com/v1/sources/add-file", formData, options)
  .then((response) => {
    
    const config = {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        responseType: "stream",
      };
  
      const data = {
        referenceSources: true,
        stream: true,
        sourceId: response.data.sourceId,
        messages: [
          {
            role: "user",
            content: "Quel est la note la plus haute?",
          },
        ],
      };
  
      axios
        .post("https://api.chatpdf.com/v1/chats/message", data, config)
        .then((response) => {
            let fullResponse = "";

            const stream = response.data;
            if (!stream) {
              throw new Error("No data received");
            }
            stream.on("data", (chunk) => {
                fullResponse += chunk.toString();
            });

            stream.on("end", () => {
                console.log(fullResponse);
            });
        })
        .catch((error) => {
          console.error("Error:", error.message);
          console.log("Response:", error.response.data);
        });
  })
  .catch((error) => {
    console.log("Error:", error.message);
    console.log("Response:", error.response.data);
  });