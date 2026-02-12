const express = require("express");
const morgan = require("morgan");
const fs = require("fs");

const productRouter = require('./modules/products/product.route');
const categoryRouter = require('./modules/catergories/category.route');
const userRouter = require('./modules/users/user.route');
const orderRouter = require('./modules/orders/order.route');
const orderItemsRouter = require('./modules/orderItems/orderItem.route');
const authJwt = require('./utils/jwt');
const errorHandler = require("./utils/errorHandler");
const setupSwagger = require("./config/swagger");

const app = express();

const logFilePath = "./http.log";
const accessLogStream = fs.createWriteStream(logFilePath, {
  flags: "a",
});

app.use(express.json());
app.use(morgan("tiny", { stream: accessLogStream }));
app.use(authJwt());

app.use('public/uploads', express.static(__dirname + 'public/uploads'));

app.use(`${process.env.API_URL}/products`, productRouter);
app.use(`${process.env.API_URL}/categories`, categoryRouter);
app.use(`${process.env.API_URL}/users`, userRouter);
app.use(`${process.env.API_URL}/orders`, orderRouter);
app.use(`${process.env.API_URL}/order-items`, orderItemsRouter);

setupSwagger(app);

app.use(errorHandler);

module.exports = app;
