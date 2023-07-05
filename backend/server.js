const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const colors = require("colors");
const userRoute = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
connectDB();

app.use("/api/user", userRoute);

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully.");
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.yellow.bold);
});
