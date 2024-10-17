import db from "../../database/connection";
import LikedPost from "../models/LikedPost";


interface Id {
    teacher_id: number;
    user_id: number;
}

export default class LikedPostDAO {
    async create(post_id: number, id: Id){
        const trx = await db.transaction();
        try {
            if(!id.teacher_id){
                await trx('likedPosts').insert({
                    post_id,
                    user_id: id.user_id,
                });
                await trx.commit();
            }else if(!id.user_id){
                await trx('likedPosts').insert({
                    post_id,
                    teacher_id: id.teacher_id,
                });
                await trx.commit();
            }else{
                console.log('Insira o id de um professor ou de um aluno')
            }
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    }
    
    
}