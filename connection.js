const mongoose = require("mongoose");

const connectToMongo = () => {
  return mongoose
    .connect("mongodb://localhost:27017/blogify")
    .then((res) => {
      console.log("MongoDB Connected!");
    })
    .catch((err) => {
      console.log("Some Error Has Occured as: ", err);
    });
};

module.exports = { connectToMongo };
