const express = require("express");
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Submit a Complaint (User Only)
router.post("/", verifyToken, async (req, res) => {
    const { category, description } = req.body;
    const user_id = req.user.id; // Get user ID from JWT

    if (!category || !description) {
        return res.status(400).json({ error: "Category and description are required." });
    }

    try {
        await db.query(
            "INSERT INTO complaints (user_id, category, description, status) VALUES (?, ?, ?, 'pending')",
            [user_id, category, description]
        );
        res.status(201).json({ message: "Complaint submitted successfully!" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "An error occurred while submitting the complaint." });
    }
});

// 📌 Get Complaints for a User
router.get("/", verifyToken, async (req, res) => {
    const user_id = req.user.id;

    try {
        const [results] = await db.query(
            "SELECT * FROM complaints WHERE user_id = ?",
            [user_id]
        );
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "An error occurred while retrieving complaints." });
    }
});

// 📌 Admin - Get All Complaints (with User Details)
router.get("/admin", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const [results] = await db.query(`
            SELECT complaints.*, users.name AS user_name, users.email AS user_email
            FROM complaints
            JOIN users ON complaints.user_id = users.id
        `);
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "An error occurred while retrieving complaints." });
    }
});


// 📌 Admin - Update Complaint Status
router.put("/:id/status", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    const { status } = req.body;
    const complaintId = req.params.id;

    if (!status) {
        return res.status(400).json({ error: "Status is required." });
    }

    try {
        await db.query(
            "UPDATE complaints SET status = ? WHERE id = ?",
            [status, complaintId]
        );
        res.json({ message: "Complaint status updated!" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "An error occurred while updating the complaint status." });
    }
});

module.exports = router;
