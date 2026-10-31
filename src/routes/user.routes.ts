import { Router } from 'express';
import { getUsers , getUserById } from '../controllers/user.controllers.js';


const router = Router();

router.get('/users', getUsers);
router.get('/getUserById/:id', getUserById)


export default router;

