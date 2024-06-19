import express from 'express';
import UserController from './controllers/UserController';
import TeacherController from './controllers/TeacherController';

const routes = express.Router();
const userController = new UserController();
const teacherController = new TeacherController();

routes.get('/teacher', teacherController.index);
routes.post('/teacher', teacherController.create)
routes.get('/teacher-login', teacherController.login)

routes.get('/user', userController.index);
routes.post('/user', userController.create)
routes.post('/forgot-password', userController.forgotPass)
routes.post('/reset-pass',userController.passReset)
routes.get('/getuser',userController.getUser)
routes.post('/avatar',userController.createAvatar)
routes.get('/avatar', userController.getImage)

export default routes;