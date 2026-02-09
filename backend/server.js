const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test Database Connection (optional, but helpful for demo)
db.getConnection()
  .then((conn) => {
    console.log("MySQL Connected Successfully!");
    conn.release();
  })
  .catch((err) => console.error("Database Connection Error:", err));

// Health route
app.get("/", (req, res) => res.send("API Running"));

// Routes
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const serviceRequestsRoutes = require("./routes/serviceRequests");
const noticeRoutes = require("./routes/notices");

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/service-requests", serviceRequestsRoutes);
app.use("/api/notices", noticeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
