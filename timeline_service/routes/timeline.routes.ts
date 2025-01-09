import express from "express"
import { validateRoute } from "../middleware/validateRoute";
import { getFeed } from "../services/timeline.service";

const router = express.Router();

router.get("/",validateRoute, getFeed);
export default router;