const mongoose = require("mongoose");
const db = `${process.env.MONGO_URI}`;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("Connection established...");
  } catch (e) {
    console.log(e.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
