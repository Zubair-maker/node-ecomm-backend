import mongoose from "mongoose";

export const connectDB = (URI: string) => {
  mongoose
    .connect(URI)
    .then((conn) =>
      console.log(
        `DB connection to ${conn.connection.host}-${conn.connection.name}`
      )
    )
    .catch((err) => console.log(err));
};


