import express        from 'express';
import exphbs         from 'express-handlebars';
import path           from 'path';
import methodOverride from 'method-override';
import multer         from 'multer';
import { v4 }         from 'uuid';

//INITIALIZATIONS
const app = express();

//IMPORTACIONES
import indexRouter from './routers/index.router';
import booksRouter from './routers/books.router';
require('./database/database');//BASE DE DATOS


//SETING
app.set('port' , process.env.PORT || 5005);

//SETTING VIEWS
app.set('views' , path.join(__dirname , 'views'));
app.engine('.hbs' ,exphbs({
    defaultLayout : 'main',
    layoutsDir    : path.join(app.get('views') , 'layouts'),
    partialsDir   : path.join(app.get('views') , 'partials'),
    extname       : '.hbs',
    helpers       : require('./lib/herpers')
}));
app.set('view engine' , '.hbs');


//MIDDLEWARES
app.use(express.urlencoded({extended : false}));
app.use(express.json());//INTERPRETAR .JSON
app.use(methodOverride('_method'));//PUT Y DELETE
const storeBook =  multer.diskStorage({
    destination : path.join(__dirname , '/public/books/'),
    filename    : (req: any , file:any , cb:any ) => {
        cb(null , v4() + path.join(file.originalname).toLowerCase());
    }
});
const uploadShoe = multer({
    storage : storeBook,
    dest    :  path.join(__dirname , '/public/books/')
}).single('zapato');
app.use(uploadShoe);


//ROUTER
app.use('/' , indexRouter);
app.use('/' , booksRouter);


//STATIC FILES
app.use(express.static(path.join(__dirname,'public')));


//STARTING THE SEVER
app.listen(app.get('port') , () => {
    console.log('SERVER RUNNING : ' , app.get('port'));
})