const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { body, validationResult } = require("express-validator");

const router = express.Router();



// User Login
router.post("/login", [
    body("email").isEmail(),
    body("password").notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, users[0].password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: users[0].id, role: users[0].role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});
router.post("/register", [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
      console.log("Checking if email exists:", email); // ✅ Debugging Log
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      
      if (existingUser.length > 0) {
          console.log("Email already in use:", email); // ✅ Debugging Log
          return res.status(400).json({ error: "Email already in use" });
      }

      console.log("Inserting user into database:", name, email); // ✅ Debugging Log
      await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
          [name, email, hashedPassword]);

      console.log("User registered successfully!"); // ✅ Debugging Log
      res.json({ message: "User registered successfully!" });
  } catch (error) {
      console.error("Database error:", error); // ✅ Debugging Log
      res.status(500).json({ error: "Database error", details: error.message });
  }
});

module.exports = router;
