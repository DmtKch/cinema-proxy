const express = require('express');
const puppeteer = require('puppeteer-core'); // Змінено на puppeteer-core
const chromium = require('@sparticuz/chromium'); // Додано для Chromium бінарників
const app = express();
const port = process.env.PORT || 10000; // Render використовує порт 10000 за замовчуванням для веб-сервісів

app.get('/scrape', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is missing' });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            args: chromium.args.concat(['--hide-scrollbars', '--disable-web-security']), // Обов'язкові аргументи для Chromium на Render
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(), // Шлях до виконуваного файлу Chromium
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        const content = await page.content();

        res.json({ content: content });

    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        res.status(500).json({ error: `Failed to scrape URL: ${error.message}` });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(port, () => {
    console.log(`Web service listening on port ${port}`);
});
