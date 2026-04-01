const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// Query 1: Insert
// Create a new magazine
router.post('/magazines', async (req, res) => {
    const {
        issn,
        mname,
        genre,
        language,
        pname,
        country,
    } = req.body;

    if (!issn || !mname || !genre || !language || !pname || !country) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: issn, mname, genre, language, pname, country',
        });
    }

    const success = await appService.insertMagazine(issn, mname, genre, language, pname, country);

    if (success) {
        return res.status(201).json({ success: true, message: 'Magazine inserted successfully.' });
    }

    return res.status(500).json({ success: false, message: 'Failed to insert magazine.' });
});

module.exports = router;