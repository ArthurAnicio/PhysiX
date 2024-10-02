// src/controllers/ClassController.ts
import { Request, Response } from "express";
import ClassScheduleDAO from "../daos/ClassScheduleDao";
import ClassSchedule from "../models/ClassSchedule";

class ClassController {
    private classScheduleDAO: ClassScheduleDAO;

    constructor() {
        this.classScheduleDAO = new ClassScheduleDAO();
    }

    async index(req: Request, res: Response): Promise<Response> {
        const { teacher_id } = req.query;

        if (!teacher_id) {
            return res.status(400).json('Informe o ID do professor');
        }

        try {
            const classSchedules = await this.classScheduleDAO.findByTeacherId(Number(teacher_id));
            if (classSchedules.length === 0) {
                return res.status(404).json('Nenhum horário encontrado para este professor');
            }
            return res.status(200).json(classSchedules);
        } catch (err) {
            return res.status(400).json(`Erro ao acessar o banco: ${err}`);
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        const { week_day, from, to, class_id } = req.body;

        if (!week_day || !from || !to || !class_id) {
            return res.status(400).json('Todos os campos são obrigatórios: week_day, from, to, class_id');
        }

        try {
            const newClassSchedule: ClassSchedule = { week_day, from, to, class_id };
            const insertedId = await this.classScheduleDAO.create(newClassSchedule);
            return res.status(201).json({ id: insertedId, ...newClassSchedule });
        } catch (err) {
            return res.status(400).json(`Erro ao criar horário da turma: ${err}`);
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.query;
        const { week_day, from, to } = req.body;

        if (!id || !week_day || !from || !to) {
            return res.status(400).json('Preencha os campos obrigatórios');
        }

        try {
            const updatedClassSchedule: ClassSchedule = { week_day, from, to, class_id: Number(id) };
            await this.classScheduleDAO.update(Number(id), updatedClassSchedule);
            return res.status(200).json('Horário atualizado com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao atualizar horário da turma: ${err}`);
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json('ID da aula é obrigatório');
        }

        try {
            await this.classScheduleDAO.delete(Number(id));
            return res.status(200).json('Horário excluído com sucesso');
        } catch (err) {
            return res.status(400).json(`Erro ao excluir horário: ${err}`);
        }
    }
}

export default ClassController;
