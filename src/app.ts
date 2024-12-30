import express from "express";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import paymentRoutes from "./routes/payment.route.js";
import statisticsRoutes from "./routes/statistics.route.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { config } from "dotenv";
import cors from "cors";
import NodeCache from "node-cache";
import morgan from "morgan";

config({
  path: "./.env",
});

const port = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI || "");

export const dataCache = new NodeCache();

const app = express();

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self' data:;");
  next();
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/statistics", statisticsRoutes);

app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`server is working on ${port}`);
});
