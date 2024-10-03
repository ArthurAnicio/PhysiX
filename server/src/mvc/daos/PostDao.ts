import { String } from "aws-sdk/clients/cloudhsm";
import db from "../../database/connection";
import Post from "../models/Post";

export default class PostDAO {
    async create(post: Post): Promise<void> {
        const trx = await db.transaction();
        try {
            await trx("posts").insert({
                teacher_id: post.teacher_id,
                text: post.text,
                likes: post.likes,
                replies: post.replies,
                upload: post.upload,
            });
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao cadastrar post: ${err}`);
        }
    }
    async getAll(): Promise<Post[]> {
        try {
            const posts = await db("posts").select("*");
            if (!posts.length) {
                throw new Error('Nenhum post encontrado');
            }
            return posts;
        } catch (err) {
            throw new Error(`Erro ao buscar posts: ${err}`);
        }
    }
    async getAllByTeacherId(teacher_id: number): Promise<Post[]> {
        try {
            const posts = await db("posts")
                .select("*")
                .where({ teacher_id });
            if (!posts.length) {
                throw new Error('Nenhum post encontrado');
            }
            return posts;
        } catch (err) {
            throw new Error(`Erro ao buscar posts do professor: ${err}`);
        }
    }
    async liked(id: number): Promise<void> {
        const trx = await db.transaction();
        try {
            await trx("posts").where({ id }).increment("likes", 1);
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao curtir post: ${err}`);
        }
    }
    async replied(id: number): Promise<void> {
        const trx = await db.transaction();
        try {
            await trx("posts").where({ id }).increment("replies", 1);
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao responder ao post: ${err}`);
        }
    }
    async deletePost(id: number): Promise<void> {
        const trx = await db.transaction();
        try {
            const postExists = await trx("posts").where({ id }).first();
            if (!postExists) {
                throw new Error('Post não encontrado');
            }
            await trx("posts").where({ id }).del();
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao excluir post: ${err}`);
        }
    }
    
    async updatePost(id: number, text: String): Promise<void> {
        const trx = await db.transaction();
        try {
            await trx("posts").where({ id }).update({ text });
            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao atualizar post: ${err}`);
        }
    }
} 