import {Request, Response} from 'express';
import db from '../database/connection';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

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
                password
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
        const token = jwt.sign({ email }, 'secret-key', { expiresIn: '1h' });
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;

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
                text: "yooooo"
            });
            return res.status(200).json('email enviado com sucesso!')
        }
        catch (err) {
            console.log(err);
            return res.status(404).json('Falha no email!');
        };
        
    }
}