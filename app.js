require("dotenv").config();
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
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
app.use(cookieParser());

const notFoundMiddleware = require("./mws/notFound.mw");
const errorHandlerMiddleware = require("./mws/errorHandler.mw");

const userRoute = require('./routes/user.routes')
const schoolRoute = require('./routes/school.routes')
const classRoute = require("./routes/classrom.routes")
const studentRoute = require("./routes/student.routes")


app.get("/", (req, res) => {
  res.send(
    `<h1>School Management System API docs </h1>  <a href="/api-docs">Documentation</a>`
  );
});

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/school", schoolRoute);
app.use("/api/v1/classroom", classRoute)
app.use("/api/v1/student", studentRoute)

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


