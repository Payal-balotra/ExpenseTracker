require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("CORS Config: Allowing localhost:5173 and " + process.env.CORS_ORIGIN);
});
