import {Response, Request} from 'express';
import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';
import multer, { FileFilterCallback, Multer } from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
interface ScheduleItem{
    week_day: number;
    from: string;
    to: string;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '././uploads/teacheravatars')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+path.extname(file.originalname))
    }
})
const upload = multer({
    storage:storage,
    fileFilter:function (req,file,cb){
        checkFileType(file,cb)
    }

})
function checkFileType(file:Express.Multer.File,cb:FileFilterCallback){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb(new Error('Error: Apenas imagens são permitidas'));
    }
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
                .select(['classes.*', 'teacher.name', 'teacher.email', 'teacher.number', 'classes.cost', 'classes.description', 'teacher.id as teacher_id', 'teacher.avatar'])
                
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
            try{
                const teacher = await db('teacher').where({name, email, password }).first();
                if(!teacher){
                    return res.status(400).json('Usuário ou senha incorretos');
                }
                return res.status(200).json(teacher);
            }
            catch(err){
                return res.status(400).json(`Erro ao acessar o banco: ${err}`);
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
                    number,
                    avatar: "uploads\\teacheravatars\\default.png"
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
                return res.status(404).json('teacher not found')
            }
            return res.status(200).json({teacher:teacher.name,email:teacher.email,id:teacher.id,avatar:teacher.avatar, password:teacher.password, number:teacher.number});
        }
        catch (err) {

            return res.status(400).json(`Erro ao acessar o banco: ${err}`);
        }
    }

    async updateTeacher(req: Request, res: Response){
        const {id} = req.query;
        const {name, email, number, password} = req.body;

        try{
            const teacher = await db('teachers').where({id}).first();
            if(!teacher){
                return res.status(400).json('Professor não encontrado');
            }
            await db('users').where({id}).update({name, email, number, password});
            return res.status(200).json('Professor atualizado com sucesso');
        }
        catch(err){
            return res.status(400).json(`Erro ao atualizar o usuário: ${err}`);
        }
        
    }

    async createAvatar(req:Request, res:Response) {
        async function registerAvatar(avatarPath:string){
            console.log(req.body.id)
            await db('teacher').where({id:parseInt(req.body.id)}).update({avatar:avatarPath})
            
        }
        try{
        
            upload.single('avatar')(req,res,(err) =>{
            if(err) {
                return res.status(400).json({message: `Error: ${err}`})
            } else if (err instanceof multer.MulterError) {
                return res.status(400).json({message: `Multer Erro: ${err}`})
            }
                if(req.file){
                
                registerAvatar(req.file.path)
                return res.status(200).json({message: 'parabeinx'})
                }
        })
            
            
        } catch(err) {
            return res.status(400).json({message:`Erro: ${err}`})
        }

    }
    async getImage(req: Request,res: Response) {
        try {
            if(req.query.route){
                const avatarRoute:string = req.query.route.toString()
                const filepath = path.join(__dirname,'..','..',avatarRoute);
                if (fs.existsSync(filepath)){
                    res.sendFile(filepath)
                } else{
                    res.status(404).json('Image not found')
                }
            }
            
        } catch(err) {
            return res.status(400).json(`Erro: ${err}`)
        }
    }
    async addFavorite(req:Request, res: Response) {
        const {
            user_id,
            teacher_id,
        } = req.body
        const trx = await db.transaction();
        const quantVerify = await trx('favorites').select('*').where({user_id,teacher_id})

        if (quantVerify.length > 0){
            await trx.rollback();
            return res.status(400).json('Professor já favoritado pelo usuário');

        }else{
            
                try{
                    await trx('favorites').insert({
                        user_id,
                        teacher_id,
                    });
                    await trx.commit();
                    return res.status(200).json('Professor favoritado com sucesso');
                }catch(err){
                    await trx.rollback();
                    return res.status(400).json(`Erro ao favoritar:${err}`);
                }
        }
    }
    async getFavorites(req:Request,res:Response) {
        const {user_id} = req.query;
        try {
            
            const favorites = await db('favorites').select('teacher_id').where({user_id})
            const ids = favorites.map(favorite => favorite.teacher_id)
            return res.status(200).json(ids);
        } catch(err) {
            return res.status(400).json(`Erro ao acessar o banco: ${err}`);
        }
    }
    async deleteFavorite(req:Request,res:Response){
        const {user_id,teacher_id} = req.query;
        try{
            await db('favorites').where({user_id,teacher_id}).del()
            const favorites = await db('favorites').orderBy('id');
            for (let i = 0; i < favorites.length; i++) {
                await db('favorites').where('id', favorites[i].id).update({ id: i + 1 });
            }

            return res.status(200).json('Favorito excluído com sucesso!')

        }catch(err) {
            return res.status(400).json(`Erro ao acessar o banco: ${err}`);
        }
    }
}