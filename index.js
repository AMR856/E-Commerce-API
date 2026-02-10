const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const fs = require("fs");
const productRouter = require('./modules/products/product.route');
const categoryRouter = require('./modules/catergories/category.route');
const userRouter = require('./modules/users/user.route');
const orderRouter = require('./modules/orders/order.route');
const orderItemsRouter = require('./modules/orderItems/orderItem.route');
const authJwt = require('./utils/jwt');
const errorHandler = require("./utils/error-handler");
const setupSwagger = require("./config/swagger");

const databaseStr = process.env.DATABASE_CONNECTION_URL;
const app = express();
const port = process.env.PORT || 3000;

const logFilePath = "./http.log";
const accessLogStream = fs.createWriteStream(logFilePath, {
  flags: "a",
});

mongoose
  .connect(databaseStr)
  .then(() => {
    console.log("Connection to the database is successful");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

app.use(express.json());
app.use(morgan("tiny", { stream: accessLogStream }));
app.use(authJwt());
app.use(errorHandler);

app.use('public/uploads', express.static(__dirname + 'public/uploads'))
app.use(`${process.env.API_URL}/products`, productRouter);
app.use(`${process.env.API_URL}/categories`, categoryRouter);
app.use(`${process.env.API_URL}/users`, userRouter);
app.use(`${process.env.API_URL}/orders`, orderRouter);
app.use(`${process.env.API_URL}/order-items`, orderItemsRouter);
setupSwagger(app);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const shutdown = () => {
  console.log("Shutting down server...");
  server.close(() => {
    accessLogStream.end(() => {
      fs.truncate(logFilePath, 0, (err) => {
        if (err) {
          console.error("Failed to clear the log file:", err);
        } else {
          console.log("Log file cleared");
        }
        process.exit(0);
      });
    });
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
