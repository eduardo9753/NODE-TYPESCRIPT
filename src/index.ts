import express        from 'express';
import exphbs         from 'express-handlebars';
import path           from 'path';
import morgan         from 'morgan';
import methodOverride from 'method-override';
import multer         from 'multer';
import connectMongo   from 'connect-mongo';
import { v4 }         from 'uuid';


//INITIALIZATIONS
const app = express();
 

//IMPORTACIONES
import indexRouter from './routers/index.router';
import booksRouter from './routers/books.router';
import userRouter  from './routers/user.router';
import connt       from './database/database';//BASE DE DATOS
require('./config/passport');                 //AUTENTICACION DEL USER y DESPUES REQ.FLAS


//MANEJO DE SESSIONES
import session        from 'express-session';
import passport       from 'passport';
import flash          from 'connect-flash';
import { ObjectId }   from 'mongoose';
const MongoStore = connectMongo(session);


//SETING PORT
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
app.use(express.json());            //INTERPRETAR .JSON
app.use(methodOverride('_method')); //PUT Y DELETE
app.use(morgan('dev'));
const storeBook =  multer.diskStorage({
    destination : path.join(__dirname , '/public/books/'),
    filename    : (req: any , file:any , cb:any ) => {
        cb(null , v4() + path.join(file.originalname).toLowerCase());
    }
});
const uploadShoe = multer({
    storage :  storeBook,
    dest    :  path.join(__dirname , '/public/books/')
}).single('zapato');
app.use(uploadShoe);

 
//MESSAGES FLASH Y SESSION
app.use(session({
    secret : process.env.SESSION_SECRET || 'secret',
    resave : false,
    saveUninitialized  : false,
    store : new MongoStore({ mongooseConnection : connt.connection})// Se usa par aguardar las sessiones en mongodb 
}));
app.use(passport.initialize());   //Inicializando passport
app.use(passport.session());      //Inicializando passport
app.use(flash());                 //Messages flash
app.use((req , res , next) => {
    res.locals.success = req.flash('success'),
    res.locals.error   = req.flash('error'),  //errores de las autenticaciones y otros
    res.locals.user    = req.user || null,    //GUARDANDO EL USER EN LA MEMORIA
    console.log('INDEX USER ID : ' , req.user); 
    next()                                    //sigue el proceso
});


//VARIABLES GLOBALES EN TYPESCRIPT
declare module "express-serve-static-core" {
    interface Request {
        user?: ObjectId;                     //VARIABLE GLOBAL PARA ACCEDER AL ID EL USER EN SESSION
    }
}


//ROUTER
app.use('/' , indexRouter);
app.use('/' , booksRouter);
app.use('/' , userRouter);


//STATIC FILES
app.use(express.static(path.join(__dirname,'public')));


//STARTING THE SEVER
app.listen(app.get('port') , () => {
    console.log('SERVER RUNNING : ' , app.get('port'));
})
