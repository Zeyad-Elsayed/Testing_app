import express, { Request, Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { pool } from "./db";
import { initDb } from "./initDb";
import clientsRoutes from "./routes/clients.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (_req: Request, res: Response): Promise<void> => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/clients", clientsRoutes);

async function startServer(): Promise<void> {
  try {
    await initDb();

    app.listen(env.port, () => {
      console.log(`Backend running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();