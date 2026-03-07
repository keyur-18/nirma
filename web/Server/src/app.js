import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRoutes from "./routes/user.routes.js";
import inverterRoutes from "./routes/inverter.routes.js";
import telemetryRoutes from "./routes/telemetry.routes.js";
import predictionRoutes from "./routes/prediction.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Solar Inverter API"
  });
});

app.use("/api/users", userRoutes);
app.use("/api/inverters", inverterRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/predictions", predictionRoutes);

// global error handler
app.use(errorMiddleware);

export default app;