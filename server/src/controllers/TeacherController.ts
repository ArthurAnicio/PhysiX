import {Response, Request} from 'express';
import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';
interface ScheduleItem{
    week_day: number;
    from: string;
    to: string;
}

export default class TeacherController{

    async index(){

    }

    async create(req: Request, res: Response){
        
        const {
            name,
            email,
            password,
            description,
            cost,
            schedule
        } = req.body;
        const trx = await db.transaction();

        const quantVerify = await trx('teacher').select('*').where({name,email})

        if (quantVerify.length > 0){
            
            return res.status(400).json('professor já registrado no sistema');

        }else{
           
            try{
                const insertedTeacherId = await trx('teacher').insert({
                    name,
                    email,
                    password
                })

                const teacher_id = insertedTeacherId[0];

                const insertedClassId = await trx('classes').insert({
                    cost,
                    description,
                    teacher_id
                })

                const class_id = insertedClassId[0];

                const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                    return {
                        class_id: class_id,
                        weak_day: scheduleItem.week_day,
                        from: convertHourToMinutes(scheduleItem.from),
                        to: convertHourToMinutes(scheduleItem.to)
                    } 
                })

                await trx('class_schedule').insert(classSchedule);

                await trx.commit();
                return res.status(201).json('professor registrado com sucesso');
            
            }catch(err){
                await trx.rollback();
                return res.status(400).json('erro ao registrar professor');
            }


        }
    }
}