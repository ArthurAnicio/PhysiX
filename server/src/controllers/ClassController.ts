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

                //console.log(classSchedules)

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
            const classExists = await db('classes').where('id', class_id).first();

            if (!classExists) {
                return res.status(400).json('A classe fornecida não existe');
            }

            
            const fromInMinutes = convertHourToMinutes(from);
            const toInMinutes = convertHourToMinutes(to);

            
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

    async update(req: Request, res: Response){
        const { id } = req.query;
        const { week_day, from, to} = req.body;

        console.log(id)
        console.log(week_day)
        console.log(from)
        console.log(to)

        if (!week_day ||!from ||!to) {
            return res.status(400).json('Preencha os campos');
        }
        else{

            try {
                const classExists = await db('class_schedule').where('id', id).first();

                if (!classExists) {
                    return res.status(400).json('A turma fornecida não existe');
                }

                const fromInMinutes = convertHourToMinutes(from);
                const toInMinutes = convertHourToMinutes(to);

                const updateClassSchedule = {
                    week_day,
                    from: fromInMinutes,
                    to: toInMinutes
                };

                const updatedClassSchedule = await db('class_schedule').where('id', id).update(updateClassSchedule);

                return res.status(200).json(updatedClassSchedule);
            } catch (err) {
                return res.status(400).json(`Erro ao acessar o banco: ${err}`);
            }

        }
    }

}