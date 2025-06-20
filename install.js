const { downloadBrowser } = require('puppeteer/lib/cjs/puppeteer/node/install.js');

downloadBrowser()
  .then(() => console.log('✅ Chromium downloaded successfully'))
  .catch(err => {
    console.error('❌ Failed to download Chromium:', err);
    process.exit(1);
  });
