import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONOGDB_URL);
    console.log(`Database connected successfully`);
  } catch (error) {
    console.log(`Error in database connection :- ${error}`);
  }
};
