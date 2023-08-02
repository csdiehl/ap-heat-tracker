const EdgeGrid = require('akamai-edgegrid');
const fs = require('fs');
const path = require('path');

// This script is run by Gitlab CI after deployments in order to bust cache

const domain = process.argv[2]; // Get the domain argument
const buildFolder = process.argv[3] || 'public'; // Get the build folder argument, defaulting to "public" if not provided

if (!domain) {
  console.error('Please provide a domain.');
  process.exit(1);
}

if (!buildFolder) {
  console.error('Please provide a build folder to deploy.');
  process.exit(1);
}

const eg = new EdgeGrid(
  process.env.AKAMAI_CLIENT_TOKEN,
  process.env.AKAMAI_CLIENT_SECRET,
  process.env.AKAMAI_ACCESS_TOKEN,
  process.env.AKAMAI_HOST
);

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walk(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
}

let files = walk(buildFolder).map(file => {
  const filePath = file.replace(new RegExp(`^${buildFolder}/`), '');
  const url = `https://${domain}/${process.env.CI_PROJECT_NAME}/${filePath}`; // Use the domain argument
  return url;
});
files.push(`https://${domain}/${process.env.CI_PROJECT_NAME}/`);

const MAX_BATCH_SIZE = 50;
for (let i = 0; i < files.length; i += MAX_BATCH_SIZE) {
  const batch = files.slice(i, i + MAX_BATCH_SIZE);
  const requestBody = { objects: batch };
  console.log(batch);

  eg.auth({
    path: '/ccu/v3/invalidate/url',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: requestBody,
  });

  eg.send((error, response, body) => {
    console.log(body);
  });
}