const puppeteer = require('puppeteer');

puppeteer
  .install()
  .then(() => console.log('✅ Chromium installed'))
  .catch((err) => {
    console.error('❌ Error installing Chromium:', err);
    process.exit(1);
  });
