const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const app = require("./app");

const databaseStr = process.env.DATABASE_CONNECTION_URL;
const port = process.env.PORT || 3000;

mongoose
  .connect(databaseStr)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error:", err));

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const shutdown = () => {
  console.log("Shutting down server...");
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
