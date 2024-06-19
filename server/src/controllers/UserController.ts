import {Request, Response} from 'express';
import db from '../database/connection';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import multer, { FileFilterCallback, Multer } from 'multer';
import path from 'path';
import fs from 'fs';
dotenv.config();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '././uploads/useravatars')
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



export default class UserController{
    
    async index(req: Request, res: Response){
        const {
            name,
            email,
            password
        } = req.query;
        try{
            const user = await db('users').where({name, email, password }).first();
            if(!user){
                return res.status(400).json('Usuário ou senha incorretos');
            }
            return res.status(200).json(user);
        }
        catch(err){
            return res.status(400).json(`Erro ao acessar o banco: ${err}`);
        }
    }

    async create(req: Request, res: Response){
        const {
            name,
            email,
            password
        } = req.body;
        
        const trx = await db.transaction();
        const quantVerify = await trx('users').select('*').where({ name, email });
        if(quantVerify.length > 0){
            res.status(400).json('O usuário ja existe no banco de dados');
        }
        else{
        try{
            await trx('users').insert({
                name,
                email,
                password,
                avatar: "uploads\\useravatars\\default.png"
            });
            await trx.commit();
            return res.status(200).json('Usuário criado com sucesso');
        }catch(err){
            await trx.rollback();
            return res.status(400).json(`Erro ao criar usuário:${err}`);
        }}
    }

    async forgotPass(req: Request, res: Response) {
        const {email} = req.body;
        const trx = await db.transaction();
        const quantVerify = await trx('users').select('*').where({email});
        if (quantVerify.length = 0) {
            return res.status(404).json('Email não cadastrado!');
        }
        const token = jwt.sign({ email }, 'keymtofodamtoincrivelcomctznvaiternenhumaviolacaousandoissopqelaegiganteetals', { expiresIn: '1h' });
        const resetLink = `http://localhost:3000/reset_pass?token=${token}`;

        try {const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
            
            })
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Recuperação de senha',
                html: `<p>Clique <a href=${resetLink}>aqui</a> para recuperar sua senha</p>`
            });
            transporter.close();
            await trx.commit();
            return res.status(200).json('email enviado com sucesso!')
        }
        catch (err) {
            console.log(err);
            await trx.rollback();
            return res.status(404).json('Falha no email!');
        };
        
    }
    async passReset(req: Request, res: Response) {
        const {token, password} = req.body;
        try {
            const decoded = await jwt.verify(token, 'keymtofodamtoincrivelcomctznvaiternenhumaviolacaousandoissopqelaegiganteetals')
            const user = await db('users').where({email: decoded.email}).first();
            if(!user) {
                return res.status(404).json('Email não cadastrado!');
            }
            await db('users').where({id: user.id}).update({password: password})
            res.status(200).json("Redefinição com sucesso!")
        }
        catch (err) {
            return res.status(404).json('Token inválido!');
        }
    }


    async getUser(req: Request, res: Response){
        const {id} = req.query;
        try {
            
            const user = await db('users').where({id}).first();
            
            if (!user) {
                return res.status(404).json('User not found')
            }
            return res.status(200).json({user:user.name,email:user.email,id:user.id,avatar:user.avatar});
        }
        catch (err) {

            return res.status(400).json(`Erro ao acessar o banco: ${err}`);
        }
    }

    async createAvatar(req:Request, res:Response) {
        async function registerAvatar(avatarPath:string){
            await db('users').where({id:parseInt(req.body.id)}).update({avatar:avatarPath})
            
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
}