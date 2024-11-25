import {Response, Request} from 'express';
import db from '../../database/connection';

class TestController{
    async test(req: Request, res: Response){
        const classes = await db('teacher')

        return res.json(classes)
    }
}

export default TestController