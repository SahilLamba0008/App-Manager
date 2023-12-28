import mongoose from "mongoose";

declare global {
  var mongoConnection: any; // This must be a `var` and not a `let / const`
}

const dbConnect = async () => {
  try {
    console.log("DB URI :", process.env.MONGODB_URI);
    if (global.mongoConnection) {
      console.log("Already connected");
      return global.mongoConnection;
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to DB");
    global.mongoConnection = connection;
    return connection;
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
};

export default dbConnect;

// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI!;
// console.log("MonogoDB URI:", uri);

// const client = new MongoClient(uri);

// let db: any;

// const dbConnect = async () => {
//   try {
//     if (!db) {
//       await client.connect();
//       db = client.db();
//       console.log("Connected to MongoDB database");
//     }
//     return db;
//   } catch (error) {
//     console.error("Connection error:", error);
//     throw error;
//   }
// };

// export default dbConnect;
