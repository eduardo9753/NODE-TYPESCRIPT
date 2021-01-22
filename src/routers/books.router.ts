import { Router } from 'express';
const router : Router = Router();

//CONTROLLER
import { booksController } from '../controllers/books.controller';

router.get('/books' , booksController.renderList);//VISTA PRINCIPAL DE LOS DATOS

router.get('/books/Form' , booksController.booksForm);//VIEWS DEL FORM PARA GUARDAR LOS LIBROS
router.post('/books/add' , booksController.bookAddForm);//RECOJO DE DATO

router.get('/books/Edit/:id' , booksController.bookEdit);//TRAENDO LOS DATOS CON EL ID DEL LIBRO
router.post('/books/update/:id' , booksController.bookUpdate);//UPDATE LIBRO

router.delete('/books/delete/:id' , booksController.bookDelete);//DELETE BOOKS

export default router;