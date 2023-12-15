import fs from 'fs';
import axios from 'axios';

const delayCounter = 1 / 5;

function configLoader() {
  const rawData = fs.readFileSync('config.json');
  const data = JSON.parse(rawData);
  return data;
}

async function dehashedApiCallDelay(url) {
  await new Promise((resolve) => setTimeout(resolve, delayCounter * 1000));
  const header = {
    'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
    'Accept': 'application/json',
  };

  const response = await axios.get(url, {
    auth: {
      username: configLoader().username,
      password: configLoader().password,
    },
    headers: header,
  });

  return response.data;
}

function dehashedApiUrlGenerator(searchTerm, size = 1000) {
  const url = `https://api.dehashed.com/search?query=${searchTerm}&size=${size}`;
  return url;
}

function jsonToText(data) {
  fs.writeFileSync('dehashed.txt', JSON.stringify(data, null, 2));
}

async function main() {
  try {
    const search = process.argv[2];
    if (!search) {
      console.log('Usage: dehashed.js <search_term>');
      return;
    }
    const data = await dehashedApiCallDelay(dehashedApiUrlGenerator(search));
    jsonToText(data.entries); 
  } catch (error) {
    console.error(error);
  }
}

main();
