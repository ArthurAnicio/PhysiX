import { Request, Response } from "express";
import db from "../database/connection"; 

export default class ClassController{

    async index(req: Request, res: Response){
        const classes = await db('classes').select('*');
        return res.status(200).json(classes);
    }

}