const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
require("dotenv").config();
const connectDB = require("./db/connectDB");
const { notFound, errorHanlder } = require("./middleware/errors");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes");
const quizRoutes = require("./routes/quiz.routes");
const submissionRoutes = require("./routes/submission.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

// Middleware
app.use(express.json()); 
app.use(cookieParser());

app.use(helmet());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quizzes", quizRoutes);
app.use("/api/v1/submissions", submissionRoutes);

// Error Hanlder Middleware
app.use(notFound);
app.use(errorHanlder);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MongoDB connected`);
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });