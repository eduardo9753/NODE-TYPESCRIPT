import passport from "passport";
import passportLocal from "passport-local";
import { NativeError } from "mongoose";

const LocalStrategy = passportLocal.Strategy;

//MODELO USER
//model save  //insterface y validacion
import UserModel, { User } from "../models/User";

//ENCRYPTACIONES
import { herpers } from "../lib/herpers";

//AUTHENTICACION DEL LOGIN(2)
passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
          //const  //interface
      const user : User = await UserModel.findOne({ email: email }).lean();

      if (!user) {
        return done(null, false, { message: "Not User Found" });
      } else {
        console.log("PASSWORD USER? : ", user.password);
        console.log("PASSWORD SIN ENCRY:", password);

        const passEncryp = await herpers.macthPass(password,user?.password);
        console.log("matchPass : ", passEncryp);
        if (passEncryp) { //SI COINCIDE
          return done(null, user, { message: `Weilcome : ${user?.name}` });
        } else {
          return done(null, false, { message: "Contraseña Incorrecta" });
        }
      }
    }
  )
);

//REGISTROS(1)
passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      console.log("DATA USER : ", req.body);
      const { email } = req.body;

      const emailFound : User = await UserModel.findOne({ email: email }).lean();
      console.log("DATA USER EMAIL: ", emailFound);

      if (emailFound) {
        done(null, false, { message: "Este Email Ya existe" });
      } else {
        //INTERFACE  //MODELO
        const user: User = new UserModel();
        user.name = req.body.name;
        user.apellido = req.body.apellido;
        user.username = username;
        user.email = req.body.email;
        user.password = await herpers.encryPass(password);
        console.log("Contraseña Encryptada", user.password);

        const result = await user.save();
        if (result) {
          return done(null, user, { message: "Registro Completo" });
        }
      }
    }
  )
);

//SERIALIZEUSER
passport.serializeUser((user, done) => {
  console.log("SERIALIZEUSER : ", user);
  done(null, user);
});

//DESERIALIZEUDER
passport.deserializeUser((id, done) => {
  console.log("SERIALIZEUSER : ", id);
  UserModel.findById(id, (err: NativeError, user: User) => {
    done(err, user.id);
  });
});
