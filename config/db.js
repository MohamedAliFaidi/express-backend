const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    console.log("Connecting to database...");
    const conn = await mongoose.connect(
      "mongodb+srv://mouhammedalifaidi:325963@cluster0.9tj6t4o.mongodb.net/?retryWrites=true&w=majority"
    );
    mongoose.set("strictQuery", false);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = dbConnect;
