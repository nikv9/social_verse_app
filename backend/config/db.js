import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mdb_uri);
    console.log("db is connected!");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
