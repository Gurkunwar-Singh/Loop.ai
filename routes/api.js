const express = require('express');
const router = express.Router();
const { handleIngest, getStatus } = require('../queueManager');

router.post('/ingest', async (req, res) => {
    const result = await handleIngest(req.body);
    res.json(result);
});

router.get('/status/:ingestionId', (req, res) => {
    const status = getStatus(req.params.ingestionId);
    res.json(status);
});

module.exports = router;
