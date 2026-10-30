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

        // sort by sort_by query parameter
        let sort = {};
        if (req.query.sort_by) {

            // split the sort_by into an array
            let sortBy = req.query.sort_by.split(".");

            // check if the first element is a valid field
            if (sortBy.length > 1 && ["numTickets"].includes(sortBy[0])) {
                sort[sortBy[0]] = sortBy[1] == "desc" ? -1 : 1;
            }
        }

        let result = await db.collection("bookings").find(query).sort(sort).skip(skip).limit(perPage).toArray();
        let total = await db.collection("bookings").countDocuments(query);

        res.json({ bookings: result, total: total, page: page, perPage: perPage });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// New Booking
router.post('/', async function (req, res) {
    const db = await connectToDB();
    try {
        req.body.numTickets = parseInt(req.body.numTickets);
        req.body.terms = req.body.terms ? true : false;
        req.body.created_at = new Date();

        let result = await db.collection("bookings").insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* Retrieve a single Booking */
router.get('/:id', async function (req, res) {
    const db = await connectToDB();
    try {
        let result = await db.collection("bookings").findOne({ _id: new ObjectId(req.params.id) });
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ message: "Booking not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a single Booking
router.put('/:id', async function (req, res) {
    const db = await connectToDB();
    try {
        if (req.body._id && req.body._id !== req.params.id) {
            throw new Error("ID in body does not match ID in URL");
        }

        req.body._id = new ObjectId(req.params.id);
        req.body.modified_at = new Date();

        let result = await db.collection("bookings").replaceOne({ _id: req.body._id }, req.body);

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Booking updated" });
        } else {
            res.status(404).json({ message: "Booking not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a single Booking
router.delete('/:id', async function (req, res) {
    const db = await connectToDB();
    try {
        let result = await db.collection("bookings").deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Booking deleted" });
        } else {
            res.status(404).json({ message: "Booking not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get the total number of bookings per superhero
router.get('/stats/superhero', async function (req, res) {
    const db = await connectToDB();
    try {
        let result = await db.collection("bookings").aggregate([
            // non null superhero
            { $match: { superhero: { $ne: null } } },
            { $match: { superhero: { $exists: true, $ne: "" } } },
            { $group: { _id: "$superhero", total: { $sum: 1 } } }
        ]).toArray();

        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;