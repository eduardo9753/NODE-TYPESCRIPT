import { Request , Response} from 'express';
import { unlink }            from 'fs-extra';
import pathUpdate            from 'path';
import pathDelete            from 'path';

     //model save  //insterface y validacion
import BookModel , { Book } from '../models/Book';

class BooksController {

    public  async renderList (req : Request , res : Response) : Promise<void> { //LIST BOOKS
       try {
        const books : Book[] = await BookModel.find({ user : Object(req.user) }).lean();
        console.log('DATA LIST BOOK DB: ' , books);
        res.render('books/books.hbs' , { title : 'List Books' , books : books });
       } catch (error) {
         console.log(error);
       }
    }

    public booksForm (req : Request , res :Response) : void {  //BOOKS FORM
        res.render('books/add.hbs' , { title : 'Books'});
    }

    public async bookAddForm (req : Request , res : Response) : Promise<void> { //RECIVO  DE DATOS
       try {
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
        book.user        = Object(req.user);
        console.log('USER ID : ' , Object(req.user));
        
        const result = await book.save();
        if(result){
            req.flash('success' , 'Book Saved....');
            res.redirect('/books');
        } else {
            req.flash('error' ,  'Book Not Saved....');
            res.redirect('/books');
        }
       } catch (error) {
         console.log(error);
       }
    }

    public async bookEdit (req : Request , res : Response) : Promise<void> {
        try {
            const { id } = req.params;
            const data : Book[] = await BookModel.findById({_id : id }).lean(); 
            console.log('DATA EDIT BOOK FOR ID: ' , data);
            res.render('books/Update.hbs' , { data : data });
        } catch (error) {
            console.log(error);
        }
    }


    public async bookUpdate (req : Request , res : Response ) : Promise<void> {
        try {
        console.log('DATA UPDATE LIBRO BODY: ', req.body);
        console.log('DATA UPDATE LIBRO FILE: ', req.file);
        
        //"path del form: path: 'D:\\NODE-JS-TYPESCRIPT\\typescript-mongodb\\src
        //                         \\public\\books\\a02fa339-ad45-4b56-bbbf-0ce084cdf6c0carousel2.jpg'"
        
        const { id } = req.params; 
        if(typeof req.file !== 'undefined') {        //AQUI HA SUBIDO ALGO PARA ACTUALIZAR 
            let title       = req.body.title;        //caja de texto
            let author      = req.body.author;       //caja de texto
            let isbn        = req.body.isbn;         //caja de texto
            let foto        = req.file.originalname; //nombre origina: "zapato.jpg"
            let encoding    = req.file.encoding;     //los bit : 7bit
            let mimetype    = req.file.mimetype;     //extension de la imagen:image/jpeg
            let destination = req.file.destination;  //Ruta general "D:\\NODE-JS-TYPESCRIPT\\typescript-mongodb\\src\\public\\books\\"
            let path        = 'books/' + req.file.filename;//ALMACENA LA RUTA 'books/nombre de la img encryptada'
            let size        = req.file.size;//peso         //filename: nombre del archivo encryptado
            let user        = Object(req.user);
            const update = await BookModel.findByIdAndUpdate(id ,{
                title ,author, isbn , foto , encoding , mimetype , destination , path , size , user
            });
            if(update){
                console.log('data Udpate : ', update.path);
                await unlink(pathUpdate.resolve('./src/public/' + update.path));//ELIMINA EL UDATE.PATH
                req.flash('success' , 'Book Update....');
                res.redirect('/books');                                    //QUE SE ACTUALIZO
            }else{
                req.flash('error' , 'Hubo un error....');
                res.redirect('/books');
            }
        } else if(typeof req.file === 'undefined'){
             try {    
                const Update  : Book = await BookModel.findById({_id : id }).lean();
                console.log('DATA UPDATE : ' , Update);
                let title       = req.body.title;      //caja de texto
                let author      = req.body.author;     //caja de texto
                let isbn        = req.body.isbn;       //caja de texto
                let foto        = Update.foto;         //nombre origina: "zapato.jpg"
                let encoding    = Update.encoding;     //los bit : 7bit
                let mimetype    = Update.mimetype;     //extension de la imagen:image/jpeg
                let destination = Update.destination;  //Ruta general "D:\\NODE-JS-TYPESCRIPT\\typescript-mongodb\\src\\public\\books\\"
                let path        = Update.path;         //ALMACENA LA RUTA 'books/nombre de la img encryptada'
                let size        = Update.size;         //peso         //filename: nombre del archivo encryptado
                let user        = Object(req.user);
                const update = await BookModel.findByIdAndUpdate(id ,{
                    title ,author, isbn , foto , encoding , mimetype , destination , path , size , user
                });
                if(update){
                    req.flash('success' , 'Update Book....');
                    res.redirect('/books');                                    //QUE SE ACTUALIZO
                }else{
                    req.flash('error' , 'Hubo un error....');
                    res.redirect('/books');
                }
             } catch (error) {
                 
             }
        }
        } catch (error) {
            console.log(error);
        }
    }


    public async bookDelete (req : Request , res : Response) : Promise<void> {
       try {
        const { id } = req.params; 
        const del = await BookModel.findByIdAndDelete({ _id : id }).lean();
        if(del){
            await unlink(pathDelete.resolve('./src/public/' + del?.path));
            req.flash('success' , 'Deleted Book....');
            res.redirect('/books');
        }else{
            req.flash('error' , 'Hubo un error....');
            res.redirect('/books');
        }
       } catch (error) {
           console.log(error);
       }
    }
}

export const booksController = new BooksController();