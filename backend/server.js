const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const colors = require("colors");
const userRoute = require("./routes/userRoute");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
connectDB();

app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.yellow.bold);
});
