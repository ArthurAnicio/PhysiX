import { Request, Response } from "express";
import Reply from "../models/Reply";
import ReplyDAO from "../daos/ReplyDao";

const replyDAO = new ReplyDAO();

export default class ReplyController {
    async index(req: Request, res: Response): Promise<Response> {
        const { post_id } = req.query;

        try {
            const replies = await replyDAO.getAllByPostId(Number(post_id));
            return res.json(replies);
        } catch (err) {
            return res.status(400).json(`Erro${err}`);
        }
    }
    
    async create(req: Request, res: Response): Promise<Response> {
        const { post_id, text, teacher_id, user_id } = req.body;
    
        if (!text || !post_id) {
            return res.status(400).json({ error: "Texto e ID do post são obrigatórios" });
        }
    
        const newReply = new Reply(
            Number(post_id),
            text,
            '[]',
            undefined,
            teacher_id ? Number(teacher_id) : undefined,
            user_id ? Number(user_id) : undefined
        );
    
        try {
            const reply = await replyDAO.create(newReply); // Recebe o Reply com ID
            return res.status(201).json(reply); // Retorna o Reply completo na resposta
        } catch (err) {
            return res.status(500).json(`Erro: ${err}`);
        }
    }

    async getLikes(req: Request, res: Response): Promise<Response>{
        const { id } = req.query;
        try {
            const likes = await replyDAO.getLikes(Number(id));
            return res.status(200).json(likes);
        } catch (err) {
            return res.status(400).json(`Erro: ${err}`);
        }
    }

    async like(req: Request, res: Response): Promise<Response> {
        const { id } = req.query;
        const { likes } = req.body;
        try {
            await replyDAO.updateLikes(Number(id),likes);
            return res.status(200).json({ message: "Reply curtida com sucesso" });
        } catch (err) {
            return res.status(400).json(`Erro${err}`);
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.query;
        const { text, teacher_id, user_id } = req.body;
    
        try {
            const updatedReply = {
                text,
                teacher_id: teacher_id ? Number(teacher_id) : undefined,
                user_id: user_id ? Number(user_id) : undefined,
            };
    
            await replyDAO.updateReply(Number(id), updatedReply);
            return res.status(200).json({ message: "Reply atualizada com sucesso" });
        } catch (err) {
            return res.status(400).json(`Erro: ${err}`);
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            await replyDAO.deleteReply(Number(id));
            return res.status(200).json({ message: "Reply excluída com sucesso" });
        } catch (err) {
            return res.status(400).json(`Erro${err}`);
        }
    }
}
