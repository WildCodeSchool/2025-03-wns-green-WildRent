import { Router } from "express";
import multer from "multer";
import { UploadService } from "../services/upload.service";

const router = Router();
const uploadService = new UploadService();

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error("Format non supporté. Utilisez JPG, PNG ou WebP."));
      return;
    }
    cb(null, true);
  },
});

/**
 * POST /api/upload/avatar/:userId
 * Uploads a user's avatar to Cloudinary and saves the URL in the database.
 */
router.post("/upload/avatar/:userId", upload.single("avatar"), async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      res.status(400).json({ error: "ID utilisateur invalide" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "Aucun fichier envoyé" });
      return;
    }

    const avatarUrl = await uploadService.uploadAvatar(userId, req.file.buffer);
    res.json({ avatar: avatarUrl });
  } catch (error: any) {
    if (error.codeError === "NOT_FOUND") {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Avatar upload error:", error);
    res.status(500).json({ error: "Échec de l'upload" });
  }
});

export default router;
