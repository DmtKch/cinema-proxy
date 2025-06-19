const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

app.get("/scrape", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing URL");

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: "networkidle2" });

    const content = await page.content();
    await browser.close();

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка при обробці сторінки");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
