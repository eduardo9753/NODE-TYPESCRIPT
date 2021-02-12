import { Request , Response } from 'express';
import passport from 'passport';


class UserController {

    public signinForm (req: Request , res : Response){
        res.render('user/signin.hbs');
    }

    public signinFormAdd = passport.authenticate('local.signin' , {
        failureRedirect : '/user/singin',
        successRedirect : '/books',
        failureFlash : true
    })



    public signupForm (req : Request , res : Response) {
       res.render('user/signup.hbs');
    }

    public signupFormAdd = passport.authenticate('local.signup' , {
       failureRedirect : '/user/signup',
       successRedirect : '/books',
       failureFlash : true
    })

    
    public logout (req : Request , res : Response) {
        req.logout();
        req.flash('success' , 'Good Bye....');
        res.redirect('/user/singin');
    }
}

export const userController = new UserController();
