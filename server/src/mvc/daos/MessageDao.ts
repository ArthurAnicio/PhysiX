import db from "../../database/connection";
import Message from "../models/Message";

export default class MessageDAO {
    async create(message: Message): Promise<Message> {
        const trx = await db.transaction();
        try {
            const [insertedId] = await trx("messages").insert({
                user_id: message.user_id,
                teacher_id: message.teacher_id,
                message: message.message,
                type: message.type,
                price: message.price,
            });
            const createdMessage = await trx("messages").where({ id: insertedId }).first();
            return createdMessage as Message;
        } catch (error) {
            await trx.rollback();
            throw error;
        } finally {
            await trx.commit();
        }
    }

    async getByUserId(userId: string): Promise<Message[]> {
        try {
            const messages = await db("messages").where({ user_id: userId }).select("*");
            return messages;
        }catch(err){
            throw new Error(`Erro ao buscar mensagens pelo user_id: ${err}`);
        }
    }

    async delete(id: number){
        const trx = await db.transaction();

        try {
            await trx("messages").where({id}).del();
            await trx.commit();
        }catch(err){
            await trx.rollback();
            throw new Error(`Erro ao deletar mensagens pelo user_id: ${err}`);
        }
    }

}