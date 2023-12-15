import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

const domain = "%25." + (process.argv[2] || ''); 
const url = "https://crt.sh/?q=" + domain;

console.log("getting details from crt.sh");

axios.get(url)
    .then((response) => {
        console.log("extracting details from the output");
        const $ = cheerio.load(response.data);
        const urls = [];

        $('table tr td:nth-child(5)').each((index, element) => {
            const text = $(element).text().trim();
            if (!text.includes('*')) {
                urls.push(text);
            }
        });

        console.log("unique domains from " + url);

        const uniqueUrls = Array.from(new Set(urls)).sort();
        const outputText = uniqueUrls.join('\n');

        const filePath = 'output.txt';
        fs.writeFileSync(filePath, outputText);

        console.log(`Output written to ${filePath}`);

        const first20Subdomains = uniqueUrls.slice(0, 20); 
        first20Subdomains.forEach((url) => {
            console.log(url);
        });
    })
    .catch((error) => {
        console.error(error.message || error);
    });

