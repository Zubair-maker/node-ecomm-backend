import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/ecommerse", {
    })
    .then((conn) => console.log(`DB connection to ${conn.connection.host}-${conn.connection.name}`))
    .catch((err) => console.log(err));
};
