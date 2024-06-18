import express from 'express';
import UserController from './controllers/UserController';
import TeacherController from './controllers/TeacherController';
import ClassController from './controllers/ClassController';

const routes = express.Router();
const userController = new UserController();
const teacherController = new TeacherController();
const classController = new ClassController();

routes.get('/teacher', teacherController.index);
routes.post('/teacher', teacherController.create)
routes.get('/teacher-login', teacherController.login)
routes.get('/getTeacher', teacherController.getTeacher)

routes.get('/user', userController.index);
routes.post('/user', userController.create) 
routes.post('/forgot-password', userController.forgotPass)
routes.post('/reset-pass',userController.passReset)
routes.get('/getuser',userController.getUser)

routes.get('/class', classController.index)
routes.post('/class', classController.create)

export default routes;