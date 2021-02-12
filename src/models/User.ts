import mongoose , { Schema , model }  from 'mongoose';

export interface User extends mongoose.Document {
    name      : string ,
    apellido  : string ,
    username  : string ,
    email     : string ,
    password  : string , 
}

const UserSchema = new Schema({
    name      : String ,
    apellido  : String ,
    username  : String ,
    email     : String ,
    password  : String , 
} , {
    timestamps : true
});



//EXPORTAMOS
export default model<User>('User' , UserSchema);