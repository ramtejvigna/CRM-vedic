import express from "express";

const router = express.Router();
import { updateBabyName, uploadExcelNames } from "../controllers/nameController.js";

router.post('/uploadExcelNames', uploadExcelNames);
router.put('/updateBabyName/:id', updateBabyName);

export default router;
