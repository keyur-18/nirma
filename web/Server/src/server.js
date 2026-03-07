import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import "./simulator/telemetrySimulation.js"
import "./simulator/inverterSimulation.js"

const PORT = env.PORT || 3000;

// connect database
connectDB();

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});