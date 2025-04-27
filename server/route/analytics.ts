import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  console.log("Analytics received:", req.body);
  res.status(200).json({ success: true });
});

export default router;