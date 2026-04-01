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

// Query 2: Update
// Update a magazine's information
router.put('/magazines/:issn', async (req, res) => {
    const { issn } = req.params;
    const {
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

    const success = await appService.updateMagazine(mname, genre, language, pname, country, issn);

    if (success) {
        return res.status(200).json({ success: true, message: 'Magazine updated successfully.' });
    }

    return res.status(404).json({ success: false, message: 'Magazine not found or update failed.' });
});

// Query 3: DELETE
// Delete a magazine if it has no issues on or after the provided cutoff date
router.delete('/magazines/:issn', async (req, res) => {
    const { issn } = req.params;
    const { cutoff_date: cutoffDate } = req.query;

    if (!issn || !cutoffDate) {
        return res.status(400).json({
            success: false,
            message: 'Missing required parameters: issn and cutoff_date (YYYY-MM-DD)',
        });
    }

    try {
        const success = await appService.deleteMagazineOlderThanDate(issn, cutoffDate);

        if (success) {
            return res.status(200).json({ success: true, message: 'Magazine deleted successfully.' });
        }

        return res.status(404).json({
            success: false,
            message: 'Magazine not found or it has issues on/after the cutoff date.',
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Query 4: SELECT
// Search for clothing items based on type, fit, and/or designer preferences
router.post('/clothes/search', async (req, res) => {
    const result = await appService.selectClothes(req.body || {});

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(500).json(result);
});

// Query 5: PROJECTION
// Display selected contributor details based on user's selection
router.post('/contributors/project', async (req, res) => {
    const { attributes } = req.body;

    if (!Array.isArray(attributes)) {
        return res.status(400).json({
            success: false,
            message: 'attributes must be provided as an array.',
            data: [],
        });
    }

    const result = await appService.projectContributorDetails({ attributes });

    if (result.success) {
        return res.status(200).json(result);
    }

    const statusCode = result.message === 'No valid attributes selected' ? 400 : 500;
    return res.status(statusCode).json(result);
});

module.exports = router;