import express from "express";

const router = express.Router();
import { uploadCsvNames, updateBabyName } from "../controllers/nameController.js";

router.post('/uploadCsvNames', uploadCsvNames);
router.put('/updateBabyName/:id', updateBabyName);

export default router;
