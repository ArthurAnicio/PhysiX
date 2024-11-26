import db from '../../database/connection';
import Invite from '../models/Invites';

export default class InviteDAO {
    async create(invite: Invite): Promise<void> {
        const trx = await db.transaction();
        try {
            await trx('invites').insert({
                user_id: invite.user_id,
                teacher_id: invite.teacher_id,
                accepted: invite.accepted,
                schedule: invite.schedule,
            });
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao criar convite: ${err}`);
        }
    }

    async findPendingByTeacher(teacher_id: number): Promise<Invite[]> {
        const trx = await db.transaction();
        try {
            const pendingInvites = await trx('invites').where({
                teacher_id: teacher_id,
                accepted: false,
            }).select('*');
            await trx.commit();
            return pendingInvites;
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao buscar convites pendentes: ${err}`);
        }
    }

    async acceptInvite(invite_id: number): Promise<void> {
        const trx = await db.transaction();
        try {
            await trx('invites').where({ id: invite_id }).update({ accepted: true });
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao aceitar convite: ${err}`);
        }
    }

    async delete(invite_id: number): Promise<void> {
        const trx = await db.transaction();
        try {
            await trx('invites').where({ id: invite_id }).del();
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao excluir convite: ${err}`);
        }
    }
}
