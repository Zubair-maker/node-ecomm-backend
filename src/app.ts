import express from "express";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import NodeCache from "node-cache";

connectDB();

export const dataCache = new NodeCache();

const app = express();

app.use(express.json());
const port = 4000;

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server is working on ${port}`);
});
