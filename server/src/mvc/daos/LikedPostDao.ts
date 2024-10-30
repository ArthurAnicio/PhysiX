import db from "../../database/connection";

export interface Id {
    teacher_id: number;
    user_id: number;
}

export default class LikedPostDAO {
    async create(post_id: number, id: Id) {
        const trx = await db.transaction();
        try {
            if (!id.teacher_id) {
                await trx('likedPosts').insert({
                    post_id,
                    user_id: id.user_id,
                });
            } else if (!id.user_id) {
                await trx('likedPosts').insert({
                    post_id,
                    teacher_id: id.teacher_id,
                });
            } else {
                console.log('Insira o id de um professor ou de um aluno');
                return;
            }
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw err;
        } finally {
            await trx.destroy();  // garante que a transação é liberada após o uso
        }
    }

    async verify(post_id: number, id: Id) {
        if (id.teacher_id) {
            const likedPost = await db('likedPosts')
                .where({ post_id, teacher_id: id.teacher_id })
                .first();
            return !!likedPost;  // retorna `true` se o like já existir
        } else if (id.user_id) {
            const likedPost = await db('likedPosts')
                .where({ post_id, user_id: id.user_id })
                .first();
            return !!likedPost;
        } else {
            console.log('Insira o id de um professor ou de um aluno');
            return false;
        }
    }
}