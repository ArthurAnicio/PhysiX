import { Request, Response } from 'express';
import InviteDAO from '../daos/InvitesDao';
import Invite from '../models/Invites';

const inviteDAO = new InviteDAO();

export default class InvitesController {

    async index(req: Request, res: Response) {
        const { teacher_id } = req.params;

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
        const { user_id, teacher_id } = req.body;

        if (!user_id || !teacher_id) {
            return res.status(400).json('Todos os campos são obrigatórios: user_id, teacher_id');
        }

        const invite = new Invite(user_id, teacher_id);

        try {
            await inviteDAO.create(invite);
            return res.status(200).json('Convite enviado com sucesso');
        } catch (err) {
            return res.status(400).json({ error: `Erro ao enviar convite: ${err}` });
        }
    }

    async accept(req: Request, res: Response) {
        const { invite_id } = req.params;

        if (!invite_id) {
            return res.status(400).json('Informe o id do convite');
        }

        try {
            await inviteDAO.acceptInvite(Number(invite_id));
            return res.status(200).json('Convite aceito com sucesso');
        } catch (err) {
            return res.status(400).json({ error: `Erro ao aceitar convite: ${err}` });
        }
    }
}
