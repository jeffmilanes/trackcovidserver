const express = require('express');
const router = express.Router();
const path = require('path');
const Scraper = require('../../services/v2/Scraper');

const scrape = new Scraper();

router.get('/', async (req, res) => {
    return res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

router.get('/local-cases', async (req, res) => {
    const data = await scrape.formatCases();
    return res.json(data);
});

router.get('/summary', async (req, res) => {
    const data = await scrape.getSummary();
    return res.json(data);
});

router.get('/location-list', async (req, res) => {
    const data = await scrape.getLocationList();
    return res.json(data);
});

router.get('/hospital-list', async (req, res) => {
    const data = await scrape.getHospitalList();
    return res.json(data);
});

module.exports = router;