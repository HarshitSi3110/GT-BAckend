
const express = require("express");
const cors = require("cors");

const app = express();

// CORS - allow frontend requests
app.use(cors());

// Request body limits
app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Tripmates Backend Running");
});

// Contact APIs
app.use("/api/contact", require("./routes/contact.routes"));

// Package APIs
app.use("/api/package", require("./routes/package.routes"));
app.use("/api/blog", require("./routes/blog.routes"));
module.exports = app;
