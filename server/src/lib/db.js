import mongoose from "mongoose";
export const connDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser: true,
      useUnifiedTopology: true,});
    console.log(`mongoDb connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Not connect MongoDb : ${error}`);
  }
};
