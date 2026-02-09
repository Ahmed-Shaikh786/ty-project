const express = require("express");
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Submit a Service Request (User Only)
router.post("/", verifyToken, async (req, res) => {
    const { title, description } = req.body;
    const user_id = req.user.id;

    if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required." });
    }

    try {
        await db.query(
            "INSERT INTO service_requests (user_id, title, description, status) VALUES (?, ?, ?, 'pending')",
            [user_id, title, description]
        );
        res.status(201).json({ message: "Service request submitted successfully!" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "An error occurred while submitting the request." });
    }
});

// 📌 Get Service Requests for a User
router.get("/", verifyToken, async (req, res) => {
    const user_id = req.user.id;

    try {
        const [results] = await db.query(
            "SELECT * FROM service_requests WHERE user_id = ?",
            [user_id]
        );
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "An error occurred while retrieving requests." });
    }
});

// 📌 Admin - Get All Service Requests
router.get("/admin", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        const [results] = await db.query(`
            SELECT sr.id, sr.title, sr.description, sr.status, sr.created_at, 
                   u.name AS user_name, u.email AS user_email 
            FROM service_requests sr 
            JOIN users u ON sr.user_id = u.id
        `);
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "An error occurred while retrieving service requests." });
    }
});

// 📌 Admin - Approve/Reject Service Request
router.put("/:id/status", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }

    const { status } = req.body;
    const requestId = req.params.id;

    if (!["pending","approved","rejected","in_progress","resolved"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value. Use: pending / approved / rejected / in_progress / resolved." });
    }

    try {
        await db.query("UPDATE service_requests SET status = ? WHERE id = ?", [status, requestId]);
        res.json({ message: "Service request status updated successfully!" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "An error occurred while updating the request status." });
    }
});

module.exports = router;
