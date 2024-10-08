// src/controllers/TeacherController.ts
import { Request, Response } from 'express';
import TeacherDAO from '../daos/TeacherDao';
import Teacher from '../models/Teacher';

const teacherDAO = new TeacherDAO();

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
            const teacher = await teacherDAO.findByEmailOrName(username as string, password as string);
            if (!teacher) {
                return res.status(400).json('Usuário ou senha incorretos');
            }
            return res.status(200).json(teacher);
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }

    async create(req: Request, res: Response) {
        const { name, email, password, number } = req.body;

        const teacher = new Teacher(name, email, password, number);

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
        const { name, email, number, password } = req.body;

        try {
            await teacherDAO.updateTeacher(Number(id), { name, email, number, password });
            return res.status(200).json('Professor atualizado com sucesso');
        } catch (err) {
            return res.status(400).json({ error: `Erro ao atualizar professor: ${err}` });
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

        const {schedule} = req.body
        const { id, week_day, from, to } = schedule;

        console.log(id, week_day, from, to)

        if (!id || week_day == undefined || !from || !to) {
            console.log(!id, !week_day, !from, !to)
            return res.status(400).json('Preencha os campos: id, week_day, from, to');
        }

        try {
            await teacherDAO.updateScheduleItem(id, schedule);
            return res.status(200).json('Horário atualizado com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao atualizar horário: ${err}`);
        }
    }

    async createAvatar(req: Request, res: Response) {
        const { teacher_id, avatar } = req.body;

        if (!teacher_id || !avatar) {
            return res.status(400).json('Todos os campos são obrigatórios: teacher_id, avatar');
        }

        try {
            await teacherDAO.updateAvatar(teacher_id, avatar);
            return res.status(200).json('Avatar atualizado com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao atualizar avatar: ${err}`);
        }
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
