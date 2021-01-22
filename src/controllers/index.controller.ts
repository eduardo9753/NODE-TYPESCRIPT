import { Request , Response } from 'express';

class IndexController {

    public index (req : Request , res :Response) : void {
        res.render('index.hbs' , { title : 'Welcome to Book App'});
    }

}

export const indexController = new IndexController();
