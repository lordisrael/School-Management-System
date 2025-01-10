require("dotenv").config();
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

const dbConnect = require("./connect/mongo");
const dotenv = require('./config/app.config')

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());

const notFoundMiddleware = require("./mws/notFound.mw");
const errorHandlerMiddleware = require("./mws/errorHandler.mw");

const userRoute = require('./routes/user.routes')


app.use("/api/v1/auth", userRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await dbConnect(dotenv.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
