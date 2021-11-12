const fs = require("fs");

const args = process.argv.slice(2);
const apiKey = args[0];
const clientId = args[1];

fs.writeFileSync(
    "src/sms_api_cred.json",
    JSON.stringify({ apiKey, clientId })
);
