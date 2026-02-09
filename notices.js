const express = require("express");
const db = require("../config/db");
const { body, validationResult } = require("express-validator");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ✅ Get all notices (Public)
 */
router.get("/", async (req, res) => {
  try {
    const [notices] = await db.query("SELECT * FROM notices ORDER BY created_at DESC");
    res.json(notices || []);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

/**
 * ✅ Add a new notice (Admin Only)
 */
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, message } = req.body;

    try {
      console.log("📢 Received Notice Data:", { title, message });

      const [result] = await db.query(
        "INSERT INTO notices (title, message, created_at) VALUES (?, ?, NOW())",
        [title, message]
      );

      console.log("✅ Database Insert Result:", result);

      if (result.affectedRows === 0) {
        return res.status(500).json({ error: "Failed to insert notice into the database" });
      }

      res.json({ message: "Notice added successfully!", noticeId: result.insertId });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to add notice", details: error.message });
    }
  }
);

/**
 * ✅ Delete a notice (Admin Only)
 */
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM notices WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json({ message: "Notice deleted successfully!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to delete notice" });
  }
});

module.exports = router;
