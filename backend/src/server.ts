import express from "express";
import router from "./routes/serviceRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import userRoutes from "./routes/userRoutes";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use(router);
app.use(authRoutes);
app.use(appointmentRoutes);
app.use(userRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Barbershop API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
