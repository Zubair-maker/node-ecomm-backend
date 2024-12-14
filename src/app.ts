import express from "express";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import paymentRoutes from "./routes/payment.route.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { config } from "dotenv";
import NodeCache from "node-cache";
import morgan from "morgan";

config({
  path: "./.env",
});

const port = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI || "");

export const dataCache = new NodeCache();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server is working on ${port}`);
});
