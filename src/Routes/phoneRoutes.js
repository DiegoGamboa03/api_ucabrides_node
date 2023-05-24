import express from 'express';
import { verifyAccessToken } from '../helpers/jwt.js';
import { indexPhoneNumber, updatePhoneNumber } from '../Controllers/phoneController.js';

const router = express.Router();

router.get('/telefono', verifyAccessToken, indexPhoneNumber);
router.post('/telefono', verifyAccessToken, updatePhoneNumber);

export default router;