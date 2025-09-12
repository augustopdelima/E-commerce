import express from "express";
import { userRoutes, productRoutes } from "./routes";
import adminProductRoutes from "./routes/admin_product_routes";

const app = express();

app.use(express.json());
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use(adminProductRoutes);

export default app;

