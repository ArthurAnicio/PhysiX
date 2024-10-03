import { Request, Response} from 'express';
import Post from '../models/Post';
import PostDAO from '../daos/PostDao';

const postDAO = new PostDAO();

export default class PostsController {
    async index(req: Request, res: Response) {
        try{
                      
            const posts = await postDAO.getAll();
            res.json(posts);
        } catch (err) {
            res.status(400).json(`Erro: ${err}`);
        }  
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
        try{
            await postDAO.create(post);
            res.status(201).json(post);
        } catch (err) {
            res.status(400).json(`Erro: ${err}`);
        } 
    }
    async getPosts(req: Request, res: Response) {
        const {teacher_id} = req.query;
        try{    
            const posts = await postDAO.getAllByTeacherId(Number(teacher_id));
            res.json(posts);
        } catch (err) {
            res.status(400).json(`Erro: ${err}`);
        } 
    }
    async like(req: Request, res: Response) {
        const {post_id} = req.query;
        try{
            await postDAO.liked(Number(post_id));
            res.status(200).json("Deu like")
        } catch (err) {
            res.status(400).json(`Erro: ${err}`);
        } 
    }
    async reply(req: Request, res: Response) {
        const {post_id} = req.query;
        try{
            await postDAO.replied(Number(post_id));
            res.status(200).json("Foi respondido")
        } catch (err) {
            res.status(400).json(`Erro: ${err}`);
        }
    }
}