import { Request , Response} from 'express';
import { unlink }            from 'fs-extra';
import pathUpdate            from 'path';
import pathDelete            from 'path';

     //model save  //insterface y validacion
import BookModel , { Book } from '../models/Book';

class BooksController {

    public  async renderList (req : Request , res : Response) : Promise<void> { //LIST BOOKS
        const books : Book[] = await BookModel.find({}).lean();
        console.log('DATA BOOK DB: ' , books);
        res.render('books/books.hbs' , { title : 'List Books' , books : books });
    }

    public booksForm (req : Request , res :Response) : void {  //BOOKS FORM
        res.render('books/add.hbs' , { title : 'Books'});
    }

    public async bookAddForm (req : Request , res : Response) : Promise<void> { //RECIVO  DE DATOS
        console.log('DATA BOOK BODY: ', req.body);
        console.log('DATA BOOK FILE: ', req.file);
        //INTERFACE  //MODELO
        const book : Book = new BookModel();
        book.title       = req.body.title;
        book.author      = req.body.author;
        book.isbn        = req.body.isbn;
        book.foto        = req.file.originalname;//NOMBRE REAL DE LA FOTO
        book.encoding    = req.file.encoding;
        book.mimetype    = req.file.mimetype;
        book.destination = req.file.destination;
        book.path        = 'books/' + req.file.filename;//  RUTA PARA ACCEDER MI IMG EN MI EACH EN EL VIEW
        book.size        = req.file.size;
        await book.save();
        res.redirect('/books');
    }

    public async bookEdit (req : Request , res : Response) : Promise<void> {
        const { id } = req.params
        const data : Book[] = await BookModel.findById({_id : id }).lean(); 
        console.log('DATA EDIT BOOK FOR ID: ' , data);
        res.render('books/Update.hbs' , { data : data });
    }

    public async bookUpdate (req : Request , res : Response ) : Promise<void> {
        console.log('DATA UPDATE LIBRO BODY: ', req.body);
        console.log('DATA UPDATE LIBRO FILE: ', req.file);
        //"path del form: path: 'D:\\NODE-JS-TYPESCRIPT\\typescript-mongodb\\src
        //                         \\public\\books\\a02fa339-ad45-4b56-bbbf-0ce084cdf6c0carousel2.jpg'"
        const { id } = req.params
        if(req.file.originalname){//AQUI HA SUBIDO ALGO PARA ACTUALIZAR 
            let title       = req.body.title;       //caja de texto
            let author      = req.body.author;      //caja de texto
            let isbn        = req.body.isbn;        //caja de texto
            let foto        = req.file.originalname;//nombre origina: "zapato.jpg"
            let encoding    = req.file.encoding;    //los bit : 7bit
            let mimetype    = req.file.mimetype;    //extension de la imagen:image/jpeg
            let destination = req.file.destination; //Ruta general "D:\\NODE-JS-TYPESCRIPT\\typescript-mongodb\\src\\public\\books\\"
            let path        = 'books/' + req.file.filename;//ALMACENA LA RUTA 'books/nombre de la img encryptada'
            let size        = req.file.size;//peso         //filename: nombre del archivo encryptado
            const update = await BookModel.findByIdAndUpdate(id ,{
                title ,author, isbn , foto , encoding , mimetype , destination , path , size
            });
            if(update){
                console.log('data Udpate : ', update.path);
                await unlink(pathUpdate.resolve('./src/public/' + update.path));//ELIMINA EL UDATE.PATH
                res.redirect('/books');                                    //QUE SE ACTUALIZO
            }else{
                res.redirect('/books');
            }
        }
    }

    public async bookDelete (req : Request , res : Response) : Promise<void> {
        const { id } = req.params; 
        const del = await BookModel.findByIdAndDelete({ _id : id });
        res.redirect('/books');
        if(del){
            await unlink(pathDelete.resolve('./src/public/' + del.path));
            res.redirect('/books');
        }else{
            res.redirect('/books');
        }
    }
}

export const booksController = new BooksController();