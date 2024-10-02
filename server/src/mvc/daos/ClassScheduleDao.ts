import db from '../../database/connection';
import ClassSchedule from '../models/ClassSchedule';

export default class ClassScheduleDAO {
    
    async findByTeacherId(teacher_id: number): Promise<ClassSchedule[]> {
        try {
            const classSchedules = await db('class_schedule')
                .join('classes', 'class_schedule.class_id', 'classes.id')
                .join('teachers', 'classes.teacher_id', 'teachers.id')
                .select('class_schedule.*')
                .where('teachers.id', teacher_id);
            return classSchedules;
        } catch (err) {
            throw new Error(`Erro ao acessar o banco: ${err}`);
        }
    }

    async create(classSchedule: ClassSchedule): Promise<number> {
        try {
            const [insertedId] = await db('class_schedule').insert(classSchedule);
            return insertedId;
        } catch (err) {
            throw new Error(`Erro ao criar horário da turma: ${err}`);
        }
    }

    async update(id: number, classSchedule: ClassSchedule): Promise<void> {
        try {
            await db('class_schedule').where('id', id).update(classSchedule);
        } catch (err) {
            throw new Error(`Erro ao atualizar horário da turma: ${err}`);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await db('class_schedule').where('id', id).del();

            const classSchedules = await db('class_schedule').orderBy('id');
            for (let i = 0; i < classSchedules.length; i++) {
                await db('class_schedule').where('id', classSchedules[i].id).update({ id: i + 1 });
            }
        } catch (err) {
            throw new Error(`Erro ao excluir horário da turma: ${err}`);
        }
    }
}
