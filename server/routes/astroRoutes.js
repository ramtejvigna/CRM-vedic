import express from 'express';
import { fetchAndStoreAstroData ,fetchAstroData,updateAstroData} from '../controllers/astroController.js';

const router = express.Router();

router.get('/api/customers/:customerId/astro', fetchAndStoreAstroData);
router.put('/api/customers/:customerId/astro', updateAstroData);
router.post('/astro', fetchAstroData)

export default router;
