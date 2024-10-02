import {Response, Request} from 'express';
import db from '../../database/connection';
import multer, { FileFilterCallback, Multer } from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

class TestController{
    async test(req: Request, res: Response){
        const classes = await db('teacher')

        return res.json(classes)
    }
}

export default TestController