import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {enhanceProfessionalSummary,enhanceJObDescription, uploadResume} from "../controllers/ai.controller.js";
import upload from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJObDescription);
aiRouter.post('/upload-resume', protect, uploadResume);

export default aiRouter;
