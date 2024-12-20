import { Request, Response } from 'express';
import UserDAO from '../daos/UserDao';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const userDAO = new UserDAO();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/useravatars');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });
const bcrypt = require('bcryptjs');

export default class UserController {
    async index(req: Request, res: Response) {
        const { username, password } = req.query;
        try {
            const user = await userDAO.findByUsernameOrEmail(username as string);
            if (!user) {
                return res.status(400).json('Usuário não encontrado!');
            }
            const isPasswordValid = bcrypt.compareSync(password as string, user.password);
            if (!isPasswordValid) {
                return res.status(401).json('Senha incorreta!');
            }
            return res.status(200).json(user);
        } catch (err) {
            return res.status(400).json(`Erro ao acessar o banco: ${err}`);
        }
    }

    async create(req: Request, res: Response) {
        const { name, email, password } = req.body;
        try {
            const existingUser = await userDAO.findByEmail(email);
            if (existingUser) {
                return res.status(400).json('O usuário já existe no banco de dados');
            }
            const salt = bcrypt.genSaltSync(10) // salt aleatório para dificultar ainda mais a quebra
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser= new User(name, email, hashedPassword);
            await userDAO.insert(newUser);
            return res.status(200).json('Usuário criado com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao criar usuário: ${err}`);
        }
    }

    async forgotPass(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const user = await userDAO.findByEmail(email);
            if (!user) {
                return res.status(404).json('Email não cadastrado!');
            }

            const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
            const resetLink = `http://localhost:3000/reset_pass?token=${token}`;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Recuperação de senha',
                html: `<p>Clique <a href=${resetLink}>aqui</a> para recuperar sua senha</p>`
            });

            return res.status(200).json('Email enviado com sucesso!');
        } catch (err) {
            return res.status(400).json('Falha ao enviar o email');
        }
    }

    async passReset(req: Request, res: Response) {
        const { token, password } = req.body;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as { email: string };
            const user = await userDAO.findByEmail(decoded.email);
            if (!user) {
                return res.status(404).json('Email não cadastrado!');
            }
            const salt = bcrypt.genSaltSync(10) // salt aleatório para dificultar ainda mais a quebra
            const hashedPassword = bcrypt.hashSync(password, salt);
            await userDAO.update(user.id!, { password:hashedPassword });
            return res.status(200).json('Redefinição com sucesso!');
        } catch (err) {
            return res.status(400).json('Token inválido');
        }
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.query;
        const { name, email} = req.body;
        try {
            const user = await userDAO.findById(Number(id));
            if (!user) {
                return res.status(400).json('Usuário não encontrado');
            }
            await userDAO.update(user.id!, { name, email });
            return res.status(200).json('Usuário atualizado com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao atualizar o usuário: ${err}`);
        }
    }
    async updateUserPassword(req:Request, res:Response){
        const {id} = req.query;
        const { oldPassword, newPassword } = req.body;
        try{
            const user = await userDAO.findById(Number(id));
            if (!user) {
                return res.status(400).json('Usuário não encontrado');
            }
            const match = bcrypt.compareSync(oldPassword, user.password);
            if (!match) {
                return res.status(401).json('Senha antiga incorreta');
            }
            const salt = bcrypt.genSaltSync(10) // salt aleatório para dificultar ainda mais a quebra
            const hashedPassword = bcrypt.hashSync(newPassword, salt);
            await userDAO.update(user.id!, { password: hashedPassword });
            return res.status(200).json('Senha atualizada com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao atualizar a senha: ${err}`);
        }
    }

    async createAvatar(req: Request, res: Response) {
        upload.single('avatar')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: `Erro: ${err}` });
            }
            const avatarPath = req.file?.path;
            if (avatarPath) {
                await userDAO.update(Number(req.body.id), { avatar: avatarPath });
                return res.status(200).json({ message: 'Avatar atualizado com sucesso!' });
            }
        });
    }

    async getImage(req: Request, res: Response) {
        const { route } = req.query;
        if (route) {
            const filepath = path.join(__dirname,'..', '..', '..', route as string);
            if (fs.existsSync(filepath)) {
                return res.sendFile(filepath);
            }

            console.log(filepath)
            return res.status(404).json('Imagem não encontrada');
        }
    }

    async getUserFavorites(req: Request, res: Response) {
        const { teacher_id } = req.query;
        try {
            const users = await userDAO.getUserFavorites(Number(teacher_id));
            return res.status(200).json(users);
        } catch (err) {
            return res.status(400).json(`Erro ao acessar o banco: ${err}`);
        }
    }
    
    async sendEmail(req:Request, res:Response) {
        const { email } = req.body;
        try {
            const user = await userDAO.findByEmail(email);
            if (!user) {
                return res.status(404).json('Email não cadastrado!');
            }

            const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
            const resetLink = `http://localhost:3000/verify_email?token=${token}`;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                tls: {
                    rejectUnauthorized: false
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verificação de Email',
                html: `<p>Clique <a href=${resetLink}>aqui</a> para verificar seu email</p>`
            });
            return res.status(200).json('Email enviado com sucesso')
        } catch (err) { 
            console.log(err);
            return res.status(400).json('Falha ao enviar o email');
        }
    }
    
    async verifyEmail(req: Request, res: Response) {
        const { token } = req.query;
        try {
            const decoded = jwt.verify(token as string, process.env.JWT_SECRET ||'secret_key') as { email: string };
            const user = await userDAO.findByEmail(decoded.email);
            if (!user) {
                return res.status(404).json('Email não cadastrado!');
            }
            await userDAO.update(user.id!, { verified: true });
            return res.status(200).json('Email verificado com sucesso!');
        } catch (err) {
            return res.status(400).json('Token inválido');
        }
    }

    async getUser(req: Request, res: Response) {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json('O ID do usuário é obrigatório');
        }

        try {
            const user = await userDAO.getUser(Number(id));
            if (!user) {
                return res.status(404).json('Usuário não encontrado');
            }
            return res.status(200).json(user);
        } catch (err) {
            return res.status(400).json(`Erro ao acessar o usuário: ${err}`);
        }
    }

}
