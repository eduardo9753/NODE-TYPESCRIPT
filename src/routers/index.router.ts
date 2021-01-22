import { Router } from 'express';
const router : Router = Router();

//CONTROLADOR
import { indexController } from '../controllers/index.controller';

//RUTAS DE LAS VIEWS
router.get('/' , indexController.index);


//  EXPORTAMOS
export default router;

