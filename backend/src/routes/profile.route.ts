import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createProfile, deleteProfile, getProfile, updateProfile, uploadResumeFile } from "../controllers/profile.controller.js";
import multer from "multer";
import { Request } from "express";
import { profileValidation } from "../middleware/validation/index.js";
import { validate } from "../middleware/validation/index.js";

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: any, cb: any) => {
    // Accept only pdf, doc, and docx files
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

const profileRouter = Router();

// Profile routes
profileRouter.get('/me', authorize, getProfile);
profileRouter.post('/me', authorize, profileValidation.createProfile, validate, createProfile);
profileRouter.put('/me', authorize, profileValidation.updateProfile, validate, updateProfile);
profileRouter.delete('/me', authorize, deleteProfile);

// Add resume upload endpoint
profileRouter.post('/upload-resume', authorize, upload.single('resume'), uploadResumeFile);

export default profileRouter;