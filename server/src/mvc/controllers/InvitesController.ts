import { Request, Response } from 'express';
import InviteDAO from '../daos/InvitesDao';
import Invite from '../models/Invites';
import { stringify } from 'querystring';

const inviteDAO = new InviteDAO();

export default class InvitesController {
    async index(req: Request, res: Response) {
        const {teacher_id} = req.query;

        if (!teacher_id) {
            return res.status(400).json('Informe o id do professor');
        }

        try {
            const pendingInvites = await inviteDAO.findPendingByTeacher(Number(teacher_id));
            return res.status(200).json(pendingInvites);
        } catch (err) {
            return res.status(400).json({ error: `Erro ao acessar o banco: ${err}` });
        }
    }

    async create(req: Request, res: Response) {
        const { user_id, teacher_id, schedule } = req.body;

        if (!user_id || !teacher_id) {
            return res.status(400).json('Todos os campos são obrigatórios: user_id');
        }

        const invite = new Invite(user_id, teacher_id, false, schedule);

        try {
            await inviteDAO.create(invite);
            return res.status(200).json('Solicitação enviado com sucesso');
        } catch (err) {
            return res.status(400).json({ error: `Erro ao enviar solicitação: ${err}` });
        }
    }

    async accept(req: Request, res: Response) {
        const { id, teacher_id, schedule } = req.body;

        if (!id) {
            return res.status(400).json('Informe o id do solicitação');
        }

        try {
            await inviteDAO.acceptInvite(Number(id), Number(teacher_id), schedule);
            return res.status(200).json('Solicitação aceita com sucesso');
        } catch (err) {
            return res.status(400).json({ error: `Erro ao aceitar solicitação: ${err}` });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json('ID do solicitação é obrigatório');
        }
        try {
            await inviteDAO.delete(Number(id));
            return res.status(200).json('Solicitação excluído com sucesso');
        } catch (err) {
            return res.status(400).json({error:`Erro ao excluir solicitação: ${err}`});
        }
    }

    async getById(req: Request, res: Response) {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json('ID do solicitação é obrigatório');
        }

        try {
            const invite = await inviteDAO.getById(Number(id));
            if (!invite) {
                return res.status(404).json('Solicitação não encontrada');
            }
            return res.status(200).json(invite);
        } catch (err) {
            return res.status(400).json({ error: `Erro ao acessar o banco: ${err}` });
        }
    }
}
