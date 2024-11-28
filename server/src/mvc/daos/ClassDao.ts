import db from "../../database/connection";
import Class from "../models/Classes";

export default class ClassDao {
    async create(classObj: Class): Promise<void> {
        const trx = await db.transaction();
        try {
            await trx("classes").insert({
                user_id: classObj.user_id,
                teacher_id: classObj.teacher_id,
                week_day: classObj.week_day,
                from: classObj.from,
                to: classObj.to,
            });
            await trx.commit();
        } catch (error) {
            trx.rollback();
            throw error;
        }
    }

    async getAll(): Promise<Class[]> {
        try {
            const classes = await db("classes").select("*");
            return classes;
        } catch (error) {
            throw error;
        }
    }

    async getAllByUserId(user_id: number): Promise<Class[]> {
        try {
            const classes = await db("classes").where({ user_id }).select("*");
            return classes;
        } catch (error) {
            throw error;
        }
    }

    async getAllByTeacherId(teacher_id: number): Promise<Class[]> {
        try {
            const classes = await db("classes").where({ teacher_id }).select("*");
            return classes;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<Class | null> {
        try {
            const result = await db("classes").where({ id }).first();
            return result || null;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        const trx = await db.transaction();
        try {
            const classExists = await trx("classes").where({ id }).first();
            if (!classExists) {
                throw new Error("Aula não encontrada");
            }
            await trx("classes").where({ id }).del();
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }

}