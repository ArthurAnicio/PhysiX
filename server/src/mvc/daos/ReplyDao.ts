import db from "../../database/connection";
import Reply from "../models/Reply";

export default class ReplyDAO {
    async create(reply: Reply): Promise<void> {
        const trx = await db.transaction();
        try {
            await trx("replies").insert({
                teacher_id: reply.teacher_id,
                user_id: reply.user_id,
                post_id: reply.post_id,
                text: reply.text,
                likes: reply.likes
            });
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao cadastrar reply: ${err}`);
        }
    }

    async getAllByPostId(post_id: number): Promise<Reply[]> {
        try {
            const replies = await db("replies").where({ post_id }).select("*");
            if (!replies.length) {
                throw new Error("Nenhuma reply encontrada");
            }
            return replies;
        } catch (err) {
            throw new Error(`Erro ao buscar replies: ${err}`);
        }
    }
    
    async getLikes(id:Number):Promise<string>{
        const likes = await db('replies').select("likes").where({ id }).first();
        if (!likes) {
            throw new Error('Nenhum like encontrado');
        }
        return likes.likes;
    }

    async updateLikes(id: number, likes: string): Promise<void> {
        try {
            await db('replies').where({ id }).update({ likes });
        } catch (err) {
            throw new Error(`Erro ao atualizar likes: ${err}`);
        }
    }

    async deleteReply(id: number): Promise<void> {
        const trx = await db.transaction();
        try {
            const replyExists = await trx("replies").where({ id }).first();
            if (!replyExists) {
                throw new Error("Reply não encontrada");
            }
            await trx("replies").where({ id }).del();
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao excluir reply: ${err}`);
        }
    }

    async updateReply(id: number, updatedReply: Partial<Reply>): Promise<void> {
        const trx = await db.transaction();
        try {
            const updatedRows = await trx("replies").where({ id }).update(updatedReply);
            if (updatedRows === 0) {
                throw new Error('Reply não encontrada');
            }
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao atualizar reply: ${err}`);
        }
    }
    
}
