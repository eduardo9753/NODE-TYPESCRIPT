import { Router } from 'express';
const router : Router = Router();

//CONTROLLER
import { booksController } from '../controllers/books.controller';
import { herpers } from '../lib/herpers'

router.get('/books' , herpers.isAuthenticated , booksController.renderList);//VISTA PRINCIPAL DE LOS DATOS

router.get('/books/Form' , herpers.isAuthenticated , booksController.booksForm);//VIEWS DEL FORM PARA GUARDAR LOS LIBROS
router.post('/books/add' , herpers.isAuthenticated , booksController.bookAddForm);//RECOJO DE DATO

router.get('/books/Edit/:id' , herpers.isAuthenticated ,booksController.bookEdit);//TRAENDO LOS DATOS CON EL ID DEL LIBRO
router.post('/books/update/:id' , herpers.isAuthenticated , booksController.bookUpdate);//UPDATE LIBRO

router.delete('/books/delete/:id' , herpers.isAuthenticated ,booksController.bookDelete);//DELETE BOOKS



export default router;