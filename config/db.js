// const mongoose = require("mongoose");
// const colors = require("colors");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);
//     console.log(
//       `Connected To Mongodb Database ${mongoose.connection.host}`.bgMagenta
//         .white
//     );
//   } catch (error) {
//     console.log(`Mongodb Database Error ${error}`.bgRed.white);
//   }
// };

// module.exports = connectDB;
const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      `Connected To MongoDB ${mongoose.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`MongoDB Error ${error}`.bgRed.white);
  }
};

module.exports = connectDB;