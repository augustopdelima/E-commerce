import express from "express";
import { userRoutes, productRoutes, addressRoutes, orderRoutes, checkoutRoutes, supplierRoutes } from "./routes";
import adminProductRoutes from "./routes/admin_product_routes";
import cartRoutes from "./routes/cart_routes";
import cors, { CorsOptions } from "cors";
import path from "path";
const app = express();
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];


const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // permite a requisição
    } else {
      callback(new Error("Not allowed by CORS")); // bloqueia
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "userid"],
  credentials: true, 
};


app.use(express.json());
app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use(checkoutRoutes);
app.use("/address", addressRoutes);
app.use("/order", orderRoutes);
app.use("/suppliers",supplierRoutes);
app.use("/cart", cartRoutes);
app.use(adminProductRoutes);

export default app;

