import { Request, Response } from "express";
import db from "../database/connection";
import convertHourToMinutes from "../utils/convertHourToMinutes";

export default class ClassController{

    async index(req: Request, res: Response){
        const { id } = req.query;
        if (!id){
            return res.status(400).json('Informe o id da turma');
        }else{
            try {
                const classSchedules = await db('class_schedule')
                    .join('classes', 'class_schedule.class_id', 'classes.id')
                    .join('teacher', 'classes.teacher_id', 'teacher.id')
                    .select('class_schedule.*')
                    .where('teacher.id', id);

        return res.json(classSchedules);
            } catch (err) {
                return res.status(400).json(`Erro ao acessar o banco: ${err}`);
            }
        }
    }

    async create(req: Request, res: Response){
        const { week_day, from, to, class_id } = req.body;

    if (!week_day || !from || !to || !class_id) {
        return res.status(400).json('Todos os campos são obrigatórios: week_day, from, to, class_id');
    }

    try {
        const classExists = await db('classes')
            .where('id', class_id)
            .first();

        if (!classExists) {
            return res.status(400).json('A classe fornecida não existe');
        }

        // Converter from e to para minutos
        const fromInMinutes = convertHourToMinutes(from);
        const toInMinutes = convertHourToMinutes(to);

        // Inserir novo horário na tabela class_schedule
        const newClassSchedule = {
            week_day,
            from: fromInMinutes,
            to: toInMinutes,
            class_id
        };

        const [insertedId] = await db('class_schedule').insert(newClassSchedule);

        return res.status(201).json({
            id: insertedId,
            ...newClassSchedule
        });
    } catch (err) {
        return res.status(400).json(`Erro ao acessar o banco: ${err}`);
    }
    }

}