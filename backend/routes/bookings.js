var express = require('express');
var router = express.Router();

const { connectToDB, ObjectId } = require('../utils/db');

// routes
router.get('/', async function (req, res) {
    const db = await connectToDB();
    try {
        let query = {};
        if (req.query.email) {
            // query.email = req.query.email;
            query.email = { $regex: req.query.email };
        }
        if (req.query.numTickets) {
            query.numTickets = parseInt(req.query.numTickets);
        }

        let page = parseInt(req.query.page) || 1;
        let perPage = parseInt(req.query.perPage) || 10;
        let skip = (page - 1) * perPage;

        let result = await db.collection("bookings").find(query).skip(skip).limit(perPage).toArray();
        let total = await db.collection("bookings").countDocuments(query);

        res.json({ bookings: result, total: total, page: page, perPage: perPage });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;