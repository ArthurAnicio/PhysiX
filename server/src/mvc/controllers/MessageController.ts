import { Request, Response } from 'express';
import MessageDAO from "../daos/MessageDao";
import Message from "../models/Message";

const messageDAO = new MessageDAO();

export default class MessageController {
    async create(req: Request, res: Response){
        const { user_id, teacher_id, invite_id, message, type, price } = req.body;
        
        if (!user_id ||!teacher_id ||!message ||!type ||!price|| !invite_id) {
            return res.status(400).json('Todos os campos são obrigatórios');
        }

        const newMessage = new Message(user_id, teacher_id, invite_id, message, type, price, );

        try {
            await messageDAO.create(newMessage);
            return res.status(201).json('Mensagem criada com sucesso');
        } catch (error) {
            return res.status(400).json({ error: `Erro ao salvar a mensagem: ${error}` });
        }
    }

    async getAllMessagesByUserId(req: Request, res: Response) {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json('ID do usuário é obrigatório');
        }

        try {
            const messages = await messageDAO.getByUserId(user_id as string);
            return res.status(200).json(messages);
        } catch (error) {
            return res.status(400).json({ error: `Erro ao buscar as mensagens: ${error}` });
        }
    }

    async updateType(req: Request, res: Response) {
        const { id, type } = req.body;
        
        if (!id ||!type) {
            return res.status(400).json('ID da mensagem e novo tipo são obrigatórios');
        }

        try {
            const updatedMessage = await messageDAO.updateType(Number(id), type);
            return res.status(200).json(updatedMessage);
        } catch (error) {
            return res.status(400).json({ error: `Erro ao atualizar o tipo da mensagem: ${error}` });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.query;

        console.log('id recebido: ' + id);

        if (!id) {
            return res.status(400).json('ID da mensagem é obrigatório');
        }

        try {
            await messageDAO.delete(Number(id));
            return res.status(200).json('Mensagem excluída com sucesso');
        } catch (error) {
            return res.status(400).json({ error: `Erro ao excluir a mensagem: ${error}` });
        }
    }
}