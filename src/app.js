const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

/*
INCREASE BODY LIMIT
*/

app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  }),
);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use(
  "/api/contact",

  require("./routes/contact.routes"),
);

/*
PACKAGE API
*/

app.use(
  "/api/package",

  require("./routes/package.routes"),
);

module.exports = app;
