import mongoose from "mongoose";

export const DBconnection = async()=>{
    const DB_URI = process.env.DB_URI;
    try {
        const connectionParams = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
        mongoose.connect(DB_URI, connectionParams);
        console.info("connection to mongodb remotely was sucesfull");
    } catch (error) {
        console.error(`There was an error during connection: ${error}`);
    }
}