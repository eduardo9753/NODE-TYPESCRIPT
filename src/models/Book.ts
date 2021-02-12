import mongoose , { Schema , model }  from 'mongoose';

export interface Book extends mongoose.Document {
    title      : string ,
    author     : string ,
    isbn       : string ,
    foto       : string , //ORIGINALNAME
    encoding   : string ,
    mimetype   : string ,
    destination: string ,
    filename   : string ,
    path       : string ,
    size       : number ,
    user       : Schema.Types.ObjectId //strin y no dio problema
}

const BookSchema = new Schema({
    title      : String ,
    author     : String ,
    isbn       : String ,
    foto       : String , //ORIGINALNAME
    encoding   : String ,
    mimetype   : String ,
    destination: String ,
    filename   : String ,
    path       : String ,
    size       : Number ,
    user       : {
        type : Schema.Types.ObjectId,
        ref  : 'User'
    }
} , {
    timestamps : true
});

export default model<Book>('Book' , BookSchema);