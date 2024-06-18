import {Response, Request} from 'express';
import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';
interface ScheduleItem{
    week_day: number;
    from: string;
    to: string;
}

export default class TeacherController{

    async index(req: Request, res: Response){
        
        const filters = req.query
        const week_days = filters.week_day as string;
        const time = filters.time as string;

        if(!week_days || !time){
            return res.status(400).json('Campos vazios')
        }
        else{
            try {
                const timeInMinutes = convertHourToMinutes(time);
                const classes = await db('classes')
                .whereExists(function(){
                        this.select('class_schedule.*')
                        .from('class_schedule')
                        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                        .whereRaw('`class_schedule`.`week_day` = ?', [week_days])
                        .whereRaw('`class_schedule`.`from` <=?', [timeInMinutes])
                        .whereRaw('`class_schedule`.`to` >?', [timeInMinutes])
                    })
                .join('teacher', 'teacher.id', '=', 'classes.teacher_id')
                .select(['classes.*', 'teacher.name', 'teacher.email', 'teacher.number', 'classes.cost', 'classes.description', 'teacher.id as teacher_id'])
                
                return res.json(classes)
            }
            catch (err){
                return res.status(400).json(`Erro ao acessar o banco:${err}`);
            }
        }
    }

    async login(req: Request, res: Response) {

        const {
            name,
            email,
            password
        } = req.query;

        if (!name || !email || !password) {
            return res.status(400).json('Campos vazios')
        }
        else {
            try {
                const teacher = await db('teacher').where({ name, email, password })
                if (teacher.length > 0){
                    return res.status(200).json(teacher)
                }
                else {
                    return res.status(400).json('Usuário ou senha incorretos')
                }
            }catch (err){
                return res.status(400).json(`Erro ao acessar o banco:${err}`);
            }
        }
    }

    async create(req: Request, res: Response){
        
        const {
            name,
            email,
            number,
            password,
            description,
            cost,
            schedule
        } = req.body;
        const trx = await db.transaction();

        const quantVerify = await trx('teacher').select('*').where({name,email})

        if (quantVerify.length > 0){
            
            return res.status(400).json('Professor já registrado no sistema');

        }else{
           
            try{
                const insertedTeacherId = await trx('teacher').insert({
                    name,
                    email,
                    password,
                    number
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
                        week_day: scheduleItem.week_day,
                        from: convertHourToMinutes(scheduleItem.from),
                        to: convertHourToMinutes(scheduleItem.to)
                    } 
                })

                await trx('class_schedule').insert(classSchedule);

                await trx.commit();
                return res.status(201).json('Professor registrado com sucesso');
            
            }catch(err){
               await trx.rollback();
                return res.status(400).json(`Erro ao registrar professor: ${err}`);
            }


        }
    }

    async getTeacher(req: Request, res: Response){
        const {id} = req.query;
        try {
            
            const teacher = await db('teacher').where({id}).first();
            
            if (!teacher){
                return res.status(404).json('User not found')
            }
            return res.status(200).json({user:teacher.name,email:teacher.email});
        }
        catch (err) {

            return res.status(400).json(`Erro ao acessar o banco: ${err}`);
        }
    }
}