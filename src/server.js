require("dotenv").config();
const dns = require("node:dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const start = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server Running on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();