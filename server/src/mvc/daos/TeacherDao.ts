import db from '../../database/connection';
import Teacher from '../models/Teacher';

export default class TeacherDAO {

    async create(teacher: Teacher): Promise<number[]> {
        const trx = await db.transaction();
        try {
            const insertedIds = await trx('teacher').insert({
                name: teacher.name,
                email: teacher.email,
                password: teacher.password,
                number: teacher.number,
                avatar: teacher.avatar,
                schedule: teacher.schedule ? teacher.schedule : null
            });

            await trx.commit();
            return insertedIds;
        } catch (err) {
            await trx.rollback();
            throw new Error(`Erro ao registrar professor: ${err}`);
        }
    }

    async findByEmailOrName(username: string, password: string) {
        try {
            const teacher = await db('teacher')
                .where(function () {
                    this.where('name', username).orWhere('email', username);
                })
                .andWhere('password', password)
                .first();
            return teacher;
        } catch (err) {
            throw new Error(`Erro ao buscar professor: ${err}`);
        }
    }

    async findById(id: number) {
        try {
            const teacher = await db('teacher').where({ id }).first();
            return teacher;
        } catch (err) {
            throw new Error(`Erro ao buscar professor: ${err}`);
        }
    }

    async updateSchedule(id: number, schedule: string) {
        try {
            await db('teacher').where({ id }).update({ schedule });
        } catch (err) {
            throw new Error(`Erro ao atualizar agenda: ${err}`);
        }
    }

    async updateTeacher(id: number, updatedFields: Partial<Teacher>) {
        try {
            await db('teacher').where({ id }).update(updatedFields);
        } catch (err) {
            throw new Error(`Erro ao atualizar professor: ${err}`);
        }
    }

    async findAll() {
        try {
            const teachers = await db('teacher').select('*');
            return teachers;
        } catch (err) {
            throw new Error(`Erro ao listar professores: ${err}`);
        }
    }

    async addFavorite(userId: number, teacherId: number) {
        return await db('favorites').insert({ user_id: userId, teacher_id: teacherId });
    }

    async getFavorites(userId: number) {
        return await db('favorites').where('user_id', userId);
    }

    async deleteFavorite(userId: number, teacherId: number) {
        return await db('favorites').where({ user_id: userId, teacher_id: teacherId }).del();
    }

    async updateAvatar(teacherId: number, avatar: string) {
        return await db('teachers').where('id', teacherId).update({ avatar });
    }

    async updateScheduleItem(id: number, weekDay: number, from: number, to: number) {
        return await db('class_schedule').where('id', id).update({ week_day: weekDay, from, to });
    }

    async classSchedule(teacherId: number) {
        return await db('class_schedule')
            .join('classes', 'class_schedule.class_id', 'classes.id')
            .join('teacher', 'classes.teacher_id', 'teacher.id')
            .select('class_schedule.*')
            .where('teacher.id', teacherId);
    }

    async createClassSchedule(newClassSchedule: any) {
        return await db('class_schedule').insert(newClassSchedule);
    }

    async deleteClassSchedule(id: number) {
        return await db('class_schedule').where('id', id).del();
    }
}
