import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

type CreateClientBody = {
  name?: string;
  phone?: string;
  unitName?: string;
};

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        phone,
        unit_name,
        created_at
      FROM clients
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch clients:", error);

    res.status(500).json({
      message: "Failed to fetch clients",
    });
  }
});

router.post(
  "/",
  async (req: Request<{}, {}, CreateClientBody>, res: Response): Promise<void> => {
    try {
      const { name, phone, unitName } = req.body;

      if (!name || name.trim() === "") {
        res.status(400).json({
          message: "Client name is required",
        });
        return;
      }

      const result = await pool.query(
        `
        INSERT INTO clients (name, phone, unit_name)
        VALUES ($1, $2, $3)
        RETURNING id, name, phone, unit_name, created_at
        `,
        [name, phone || null, unitName || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Failed to create client:", error);

      res.status(500).json({
        message: "Failed to create client",
      });
    }
  }
);

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        message: "Invalid client id",
      });
      return;
    }

    const result = await pool.query(
      `
      DELETE FROM clients
      WHERE id = $1
      RETURNING id, name, phone, unit_name, created_at
      `,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        message: "Client not found",
      });
      return;
    }

    res.json({
      message: "Client deleted successfully",
      client: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to delete client:", error);

    res.status(500).json({
      message: "Failed to delete client",
    });
  }
});

export default router;