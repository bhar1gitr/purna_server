const express = require('express');
const router = express.Router();
const Voter = require('../models/Voters');

// Route to get all voters for the initial offline download
router.get('/download-voters', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5000;
        const skip = parseInt(req.query.skip) || 0;

        const voters = await Voter.find({ 
            isDeleted: { $ne: true } // Handles existing 50k records without this field
        })
        .select('name epic_id age gender isVoted part mahanagarpalika')
        .skip(skip)
        .limit(limit)
        .lean();

        const total = await Voter.countDocuments({ isDeleted: { $ne: true } });

        res.status(200).json({
            voters,
            total,
            hasMore: skip + limit < total
        });
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ error: "Failed to fetch voters" });
    }
});

module.exports = router;