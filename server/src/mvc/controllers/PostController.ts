import { Request, Response } from 'express';
import Post from '../models/Post';
import PostDAO from '../daos/PostDao';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const postDAO = new PostDAO();

// Configuração de multer para uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/postsUploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

export default class PostsController {
    async index(req: Request, res: Response) {
        try {
            const posts = await postDAO.getAll();
            res.json(posts);
        } catch (err) {
            res.status(400).json(`Erro: ${err}`);
        }
    }

    async create(req: Request, res: Response) {
        // Faz upload da imagem antes de criar o post
        upload.single('upload')(req, res, async (err) => {
            if (err) {
                return res.status(400).json(`Erro no upload: ${err}`);
            }
            
            const { teacher_id, text } = req.body;
            const uploadPath = req.file ? req.file.path : null;

            const post = new Post(
                Number(teacher_id),
                text,
                0, // likes
                0, // replies
                undefined, // created_at
                uploadPath // caminho do arquivo carregado
            );
            
            try {
                await postDAO.create(post);
                res.status(201).json(post);
            } catch (err) {
                res.status(400).json(`Erro: ${err}`);
            }
        });
    }

    async getPosts(req: Request, res: Response) {
        const { teacher_id } = req.query;
        try {
            const posts = await postDAO.getAllByTeacherId(Number(teacher_id));
            res.json(posts);
        } catch (err) {
            res.status(400).json(`Erro: ${err}`);
        }
    }

    async delete(req: Request, res: Response) {
        const { post_id } = req.query;
        try {
            await postDAO.deletePost(Number(post_id));
            res.status(200).json('Post deletado');
        } catch (err) {
            res.status(400).json(`Erro: ${err}`);
        }
    }

    async update(req: Request, res: Response) {
        upload.single('upload')(req, res, async (err) => {
            if (err) {
                return res.status(400).json(`Erro no upload: ${err}`);
            }

            const { post_id } = req.query;
            const { text } = req.body;
            const uploadPath = req.file ? req.file.path : null;

            try {
                await postDAO.updatePost(Number(post_id), text);
                res.status(200).json('Post atualizado');
            } catch (err) {
                res.status(400).json(`Erro: ${err}`);
            }
        });
    }

    async like(req: Request, res: Response) {
        const { post_id } = req.query;
        try {
            await postDAO.liked(Number(post_id));
            res.status(200).json('Deu like');
        } catch (err) {
            res.status(400).json(`Erro: ${err}`);
        }
    }

    async reply(req: Request, res: Response) {
        const { post_id } = req.query;
        try {
            await postDAO.replied(Number(post_id));
            res.status(200).json('Foi respondido');
        } catch (err) {
            res.status(400).json(`Erro: ${err}`);
        }
    }
    async getUpload(req: Request, res: Response) {
        const { route } = req.query;
        if (route) {
            const filepath = path.join(__dirname, '..', '..', '..', route as string);
            if (fs.existsSync(filepath)) {
                return res.sendFile(filepath);
            }

            return res.status(404).json('Upload não encontrado');
        }
    }
}
