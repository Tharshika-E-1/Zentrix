import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/auth.js";
import { getWeeklyActivity } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", protect, getDashboard);
router.get("/weekly-activity", protect, getWeeklyActivity);


export default router;