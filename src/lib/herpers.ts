import bcrypjs from "bcryptjs";


class Helpers {
  
  //ENCRIPTACIONES
  encryPass = async (password : any) => {
    const salt = await bcrypjs.genSalt(10);
    return await bcrypjs.hash(password, salt);
  };

  
  //DESENCRIPTANDO
  macthPass = async function (password: any, savedPassword: any) {
    try {
      return await bcrypjs.compare(password, savedPassword);
    } catch (e) {
      console.log("ERROR DE DESCRIPTACION", e);
    }
  };

  
  //isauthenticate
  isAuthenticated = (req : any , res : any , next:any) => {
      if(req.isAuthenticated()) {
          return next();
      } else {
          req.flash('error' , 'NOT AUTHORIZED');
          res.redirect('/user/singin')
      }
  }
}
export const herpers = new Helpers();


