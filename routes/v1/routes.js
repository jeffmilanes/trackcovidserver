const express = require('express');
const router = express.Router();
const path = require('path');
const Scraper = require('../../services/v1/Scraper');

const scrape = new Scraper();

router.get('/', async (req, res) => {
    return res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

router.get('/summary', async (req, res) => {
    const data = await scrape.getSummary();
    return res.json(data);
});

router.get('/case', async (req, res) => {
    const data = await scrape.getCase();
    return res.json(data);
});

router.get('/case-outside', async (req, res) => {
    const data = await scrape.getCaseOutside();
    return res.json(data);
});

module.exports = router;