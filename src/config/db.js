const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4
    });
    console.log('Mongo Connected:', mongoose.connection.name);
console.log('Mongo Host:', mongoose.connection.host);
console.log('Package Collection:', mongoose.connection.collection('packages').name);

const count = await mongoose.connection.collection('packages').countDocuments();

console.log('Packages in connected database:', count);

    console.log("Mongo Connected ✅");
  } catch (error) {
    console.log("Mongo Error ❌");
    console.log(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;