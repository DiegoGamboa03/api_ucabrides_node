import express from 'express'
const router = express.Router();
import { login, register, register_gmail } from '../Controllers/authControllers.js'

router.post('/register', register);
router.post('/register/gmail', register_gmail)
router.post('/login', login)


export default router