import express from 'express';
import multer from 'multer';
import {
  listMedia,
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia,
  searchMedia
} from '../controllers/mediaController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  createMediaSchema,
  updateMediaSchema,
  paginationSchema,
} from '../validators/mediaValidator.js';

const router = express.Router();
const upload = multer(); 

// Public routes
router.get("/search", searchMedia);
router.get('/', validate(paginationSchema), listMedia);
router.get('/:id', getMedia);


// Protected routes
router.post('/', authenticate, upload.single('poster'), validate(createMediaSchema), createMedia);
router.put('/:id', authenticate, upload.single('poster'), validate(updateMediaSchema), updateMedia);
router.delete('/:id', authenticate, deleteMedia);


export default router;
