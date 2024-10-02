import { Request, Response} from 'express';
import Post from '../models/Post';
import PostDAO from '../daos/PostDao';

const postDAO = new PostDAO();

export default class PostsController {
    async index(req: Request, res: Response) {
        const posts = await postDAO.getAll();
        res.json(posts);
    }
    async create(req: Request, res: Response) {
        const {teacher_id, text, upload } = req.body;

        const post = new Post(
            teacher_id,  
            text,
            0,  
            0,
            undefined,  
            upload || null
        );

        await postDAO.create(post);
        res.status(201).json(post);
    }
    async getPosts(req: Request, res: Response) {
        const {teacher_id} = req.query;
        const posts = await postDAO.getAllByTeacherId(Number(teacher_id));
        res.json(posts);
    }
}