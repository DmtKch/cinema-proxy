const express = require('express');
const puppeteer = require('puppeteer'); // npm install puppeteer

const app = express();
const PORT = process.env.PORT || 3000; // Render надає змінну оточення PORT

app.get('/get_html', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is missing' });
    }

    let browser;
    try {
        // Запускаємо Puppeteer у безголовому режимі
        // 'args': ['--no-sandbox'] - важливо для роботи на Render
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        // Переходимо на сторінку
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); // Збільшення таймауту

        // Зачекайте деякий час, якщо Cloudflare має додаткові перевірки
        // Це може бути корисно, але не завжди необхідно.
        // await page.waitForTimeout(5000); // 5 секунд очікування

        // Отримуємо повний HTML-вміст сторінки
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
