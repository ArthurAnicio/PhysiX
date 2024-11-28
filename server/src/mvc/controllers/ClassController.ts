import { Request, Response } from "express";
import ClassDao from "../daos/ClassDao";
import Class from "../models/Classes";

const classDao = new ClassDao();

export default class ClassController {
    async index(req: Request, res: Response){
        try {
            const classes = await classDao.getAll();
            return res.status(200).json(classes);
        }catch (err) {
            return res.status(400).json(`Erro: ${err}`);
        }
    }

    async create(req: Request, res: Response){
        const { user_id, teacher_id, week_day, from, to } = req.body;
        
        if (!user_id ||!teacher_id||!week_day || !from || !to) {
            return res.status(400).json('Todos os campos são obrigatórios');
        }
        
        const classObj = new Class(user_id, teacher_id, week_day, from, to);

        try {
            await classDao.create(classObj);
            return res.status(200).json('Classe criada com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro: ${err}`);
        }
    }

    async getByUser(req: Request, res: Response){
        const { user_id } = req.query;
        
        if (!user_id) {
            return res.status(400).json('Informe o ID do usuário');
        }

        try {
            const classes = await classDao.getAllByUserId(Number(user_id));
            return res.status(200).json(classes);
        } catch (err) {
            return res.status(400).json(`Erro: ${err}`);
        }
    }

    async getByTeacher(req: Request, res: Response){
        const { teacher_id } = req.query;
        
        if (!teacher_id) {
            return res.status(400).json('Informe o ID do professor');
        }

        try {
            const classes = await classDao.getAllByTeacherId(Number(teacher_id));
            if (classes) {
                return res.status(200).json(classes);
            } else {
                return res.status(404).json('Nenhuma classe encontrada para este professor');
            }
        } catch (err) {
            return res.status(400).json(`Erro: ${err}`);
        }
    }

    async getById(req: Request, res: Response){
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json('Informe o ID da classe');
        }

        try {
            const classObj = await classDao.findById(Number(id));
            if (!classObj) {
                return res.status(404).json('Classe não encontrada');
            }
            return res.status(200).json(classObj);
        } catch (err) {
            return res.status(400).json(`Erro: ${err}`);
        }
    }

    async delete(req: Request, res: Response){
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json('Informe o ID da classe');
        }

        try {
            await classDao.delete(Number(id));
            return res.status(200).json('Classe deletada com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro: ${err}`);
        }
    }
}