const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/get_html', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is missing' });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            // executablePath: puppeteer.executablePath(), // ВИДАЛІТЬ АБО ЗАКОМЕНТУЙТЕ ЦЕЙ РЯДОК
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Важливо для обмежених середовищ, як Render
                '--disable-accelerated-video-decode',
                '--disable-gpu',
                '--disable-background-networking',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-first-run',
                '--no-default-browser-check',
                '--no-initial-navigation',
                '--noerrdialogs',
                '--single-process' // Може допомогти в деяких середовищах
            ],
        });
        const page = await browser.newPage();

        // Встановіть User-Agent, щоб сайт не міг легко виявити Puppeteer
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36');

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Можливо, потрібно буде додати невелику затримку або очікування певного елемента
        // для сайтів, які мають складні перевірки Cloudflare або динамічний контент.
        // await new Promise(resolve => setTimeout(resolve, 3000)); // Зачекати 3 секунди

        const html = await page.content();

        res.json({ html: html });

    } catch (error) {
        console.error(`Error fetching HTML for ${url}:`, error);
        res.status(500).json({ error: error.message || 'Failed to fetch HTML' });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
