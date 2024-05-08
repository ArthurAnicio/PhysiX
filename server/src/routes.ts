import express from 'express';
import UserController from './controllers/UserController';
import TeacherController from './controllers/TeacherController';

const routes = express.Router();
const userController = new UserController();
const teacherController = new TeacherController();

routes.get('/teacher', teacherController.index);
routes.post('/teacher', teacherController.create)

routes.get('/user', userController.index);
routes.post('/user', userController.create)

export default routes;