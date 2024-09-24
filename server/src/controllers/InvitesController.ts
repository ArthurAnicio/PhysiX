import { Request, Response } from "express";
import db from "../database/connection";

class InvitesController{

    async index(req: Request, res: Response){
        const {teacher_id} = req.params;
        const trx = await db.transaction();
        if (teacher_id){ 
            try {
                const pendingInvites = await trx('invites').where({teacher_id: teacher_id, accepted: false}).select('*');
                await trx.commit();
                return res.status(200).json(pendingInvites);
            }catch (err) {
                await trx.rollback();
                return res.status(400).json(`Erro ao acessar o banco: ${err}`);
            }
        }else{
            return res.status(400).json('Informe o id do professor');
        }
    }
    async create(req: Request, res: Response) {
        const { user_id, teacher_id } = req.body;
        const trx = await db.transaction();
    
        if (!user_id || !teacher_id) {
            return res.status(400).json('Todos os campos são obrigatórios: user_id, teacher_id');
        }
    
        try {
            await trx('invites').insert({
                user_id,
                teacher_id,
                accepted: false
            });
            await trx.commit();
            return res.status(200).json('Convite enviado com sucesso');
        } catch (err) {
            await trx.rollback();
            console.log(err);
            return res.status(400).json(`Erro ao enviar convite: ${err}`);
        }    
    }

    async accept(req: Request, res: Response){
        const {invite_id} = req.params;
        const trx = await db.transaction();

        if (invite_id){
            try {
                await trx('invites').where({id: invite_id}).update({accepted: true});
                await trx.commit();
                return res.status(200).json('Convite aceito com sucesso');
            }catch (err) {
                await trx.rollback();
                return res.status(400).json(`Erro ao aceitar convite: ${err}`);
            }
        }else{
            return res.status(400).json('Informe o id do convite');
        }
    }

}

export default InvitesController;