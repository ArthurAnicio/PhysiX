import {Response, Request} from 'express';
import db from '../database/connection';
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

            try {                    
                const teachers = await db('teacher')
                return res.json(teachers)
            }
            catch (err){
                return res.status(400).json(`Erro ao acessar o banco:${err}`);
            }
        }

    async login(req: Request, res: Response) {

        const {
            username,
            password
        } = req.query;

        if (!username || !password) {
            return res.status(400).json('Campos vazios')
        }
        else {
            try{
                const teacher = await db('teacher')
  .where(function() {
    this.where('name', username)
      .orWhere('email', username);
  })
  .andWhere('password', password)
  .first();
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
            return res.status(200).json({teacher:teacher.name,email:teacher.email,id:teacher.id,avatar:teacher.avatar, password:teacher.password, number:teacher.number, schedule:teacher.schedule});
        }
        catch (err) {

            return res.status(400).json(`Erro ao acessar o banco: ${err}`);
        }
    }

    async updateSchedule(req: Request, res: Response) {
        const {id} = req.query;
        const {schedule} = req.body;
        try {
            const teacher = await db('teacher').where({id}).first();
            if(!teacher){
                return res.status(400).json('Professor não encontrado');
            }
            console.log(schedule)
            await db('teacher').where({id}).update({schedule});
            return res.status(200).json('Usuário atualizado com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao atualizar a agenda: ${err}`);
        }
    }

    async updateScheduleItem(req: Request, res: Response) {

        interface Schedule {
            id: string;
            week_day: number;
            from: string;
            to: string;
        }

        const {id} = req.query;
        const {teacherId} = req.query;
        const {schedule} = req.body;

        try {
            const teacher = await db('teacher').where({id: teacherId}).first();
            if(!teacher){
                return res.status(400).json('Professor não encontrado');
            }
            const oldArr:Schedule[] = JSON.parse(teacher.schedule)
            
            let newArr = oldArr.filter((schedule:Schedule) => schedule.id != id)
            newArr.push(schedule);

            console.log(newArr)

            await db('teacher').where({id: teacherId}).update({schedule: JSON.stringify(newArr)});

            return res.status(200).json('Usuário atualizado com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao atualizar a agenda: ${err}`);
        }
    }

    

    async updateTeacher(req: Request, res: Response){
        const {id} = req.query;
        const {name, email, number, password} = req.body;
        
        try{
            const teacher = await db('teacher').where({id}).first();
            if(!teacher){
                return res.status(400).json('Usuário não encontrado');
            }
            await db('teacher').where({id}).update({name, email, number, password});
            return res.status(200).json('Usuário atualizado com sucesso');
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