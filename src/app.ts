import express from "express";
import userRoutes  from "./routes/user.route.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

connectDB()

app.use(express.json());
const port = 4000;

app.use("/api/v1/user",userRoutes);


app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`server is working on ${port}`);
});
