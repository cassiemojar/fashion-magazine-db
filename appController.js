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

// Fetch magazine table
router.get('/magtable', async (req, res) => {
    const tableContent = await appService.fetchMagtableFromDb();
    res.json({data: tableContent});
});

//Initialize database
router.post("/init-db", async (req, res) => {
    const initiateResult = await appService.initiateDatabase();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
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

// Query 6: JOIN
// Find all first-page articles in a given magazine, in descending order of issue date
router.get('/articles/first-page', async (req, res) => {
    const { issn } = req.query;

    if (!issn) {
        return res.status(400).json({ success: false, message: 'Missing required query parameter: issn', data: [] });
    }

    const result = await appService.joinArticleIssue({ issn });

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(500).json(result);
});

// Query 7: GROUP BY
// Count how many authors worked on each magazine issue
router.get('/analytics/authors-per-magazine-issue', async (req, res) => {
    const result = await appService.countAuthorsPerMagazineIssue();

    if (result === -1) {
        return res.status(500).json({ success: false, message: 'Failed to fetch author counts.', data: [] });
    }

    return res.status(200).json({ success: true, data: result });
});

// Query 8: AGGREGATION with HAVING
router.get('/avg-sponsor-salary', async (req, res) => {
    const outputTable = await appService.avgSponsorSalary();
    if (outputTable.length >= 0) {
        res.json({ 
            success: true,  
            data: outputTable
        });
    } else {
        res.status(500).json({ 
            success: false, 
            data: []
        });
    }
});

// Query 9: NESTED AGGREGATION with GROUP BY
router.get("/query9-nested-agg", async (req, res) => {
    const result = await appService.query9NestedAgg();
    if (result.success) {
        res.json({ success: true, data: result.data });
    } else {
        res.status(500).json({ success: false, message: result.message });
    }
});

// Query 10: DIVISION
router.get("/query10-division", async (req, res) => {
    const result = await appService.query10Division();
    if (result.success) {
        res.json({ success: true, data: result.data });
    } else {
        res.status(500).json({ success: false, message: result.message });
    }
});

module.exports = router;
