// src/controllers/TeacherController.ts
import { Request, Response } from 'express';
import TeacherDAO from '../daos/TeacherDao';
import Teacher from '../models/Teacher';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const bcrypt = require('bcryptjs');

const teacherDAO = new TeacherDAO();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/useravatars');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

export default class TeacherController {

    async index(req: Request, res: Response) {
        try {
            const teachers = await teacherDAO.findAll();
            return res.status(200).json(teachers);
        } catch (err) {
            return res.status(400).json({ error: `Erro ao listar professores: ${err}` });
        }
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.query;
        if (!username || !password) {
            return res.status(400).json('Campos vazios');
        }

        try {
            const teacher = await teacherDAO.findByEmailOrName(username as string);
            if (!teacher) {
                return res.status(400).json('Usuário não encontrado!');
            }
            const isMatch = bcrypt.compareSync(password as string, teacher.password);
            if (!isMatch) {
                return res.status(401).json('Senha incorreta!');
            }
            return res.status(200).json(teacher);
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }

    async create(req: Request, res: Response) {
        const { name, email, password, number } = req.body;

        const salt = bcrypt.genSaltSync(10) // salt aleatório para dificultar ainda mais a quebra
        const hashedPassword = bcrypt.hashSync(password, salt); 
        const teacher = new Teacher(name, email, hashedPassword, number);

        try {
            await teacherDAO.create(teacher);
            return res.status(201).json('Professor registrado com sucesso');
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }

    async getTeacher(req: Request, res: Response) {
        const { id } = req.query;
        try {
            const teacher = await teacherDAO.findById(Number(id));
            if (!teacher) {
                return res.status(404).json('Professor não encontrado');
            }
            return res.status(200).json(teacher);
        } catch (err) {
            return res.status(400).json({ error: `Erro ao acessar o banco: ${err}` });
        }
    }

    async updateTeacher(req: Request, res: Response) {
        const { id } = req.query;
        const { name, email, number} = req.body;

        try {
            await teacherDAO.updateTeacher(Number(id), { name, email, number});
            return res.status(200).json('Professor atualizado com sucesso');
        } catch (err) {
            return res.status(400).json({ error: `Erro ao atualizar professor: ${err}` });
        }
    }
    async updateTeacherPassword(req:Request, res:Response){
        const {id} = req.query;
        const { oldPassword, newPassword } = req.body;
        try{
            const teacher = await teacherDAO.findById(Number(id));
            if (!teacher) {
                return res.status(400).json('Professor não encontrado');
            }
            const match = bcrypt.compareSync(oldPassword, teacher.password);
            if (!match) {
                return res.status(401).json('Senha antiga incorreta');
            }
            const salt = bcrypt.genSaltSync(10) // salt aleatório para dificultar ainda mais a quebra
            const hashedPassword = bcrypt.hashSync(newPassword, salt);
            await teacherDAO.updateTeacher(teacher.id!, { password: hashedPassword });
            return res.status(200).json('Senha atualizada com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao atualizar a senha: ${err}`);
        }
    }

    async updateSchedule(req: Request, res: Response) {
        const { id } = req.query;
        const { schedule } = req.body;
        try {
            await teacherDAO.updateSchedule(Number(id), schedule);
            return res.status(200).json('Agenda atualizada com sucesso');
        } catch (err) {
            return res.status(400).json({ error: `Erro ao atualizar a agenda: ${err}` });
        }
    }

    async updateScheduleItem(req: Request, res: Response) {
        const {id} = req.query;
        const {schedule} = req.body

        try {
            await teacherDAO.updateScheduleItem(Number(id), schedule);
            return res.status(200).json('Horário atualizado com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao atualizar horário: ${err}`);
        }
    }

    async createAvatar(req: Request, res: Response) {
        upload.single('avatar')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: `Erro: ${err}` });
            }
            const avatarPath = req.file?.path;
            if (avatarPath) {
                await teacherDAO.updateAvatar(Number(req.body.id), avatarPath );
                return res.status(200).json({ message: 'Avatar atualizado com sucesso!' });
            }
        });
    }

    async addFavorite(req: Request, res: Response) {
        const { user_id, teacher_id } = req.body;

        if (!user_id || !teacher_id) {
            return res.status(400).json('Todos os campos são obrigatórios: user_id, teacher_id');
        }

        try {
            await teacherDAO.addFavorite(user_id, teacher_id);
            return res.status(200).json('Professor favorito adicionado com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao adicionar favorito: ${err}`);
        }
    }

    async getFavorites(req: Request, res: Response) {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json('O ID do usuário é obrigatório');
        }

        try {
            const favorites = await teacherDAO.getFavorites(Number(user_id));
            return res.status(200).json(favorites);
        } catch (err) {
            return res.status(400).json(`Erro ao acessar os favoritos: ${err}`);
        }
    }

    async deleteFavorite(req: Request, res: Response) {
        const { user_id, teacher_id } = req.body;

        if (!user_id || !teacher_id) {
            return res.status(400).json('Todos os campos são obrigatórios: user_id, teacher_id');
        }

        try {
            await teacherDAO.deleteFavorite(user_id, teacher_id);
            return res.status(200).json('Favorito removido com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao remover favorito: ${err}`);
        }
    }
}
