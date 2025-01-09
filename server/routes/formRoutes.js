import express from 'express';
import { 
    getAllImages, 
    createImage, 
    updateImage, 
    deleteImage 
} from '../controllers/formControllers.js';

const router = express.Router();

router.get('/', getAllImages);
router.post('/', createImage);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

export default router;