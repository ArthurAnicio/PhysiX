import express from 'express';
import UserController from './mvc/controllers/UserController';
import TeacherController from './mvc/controllers/TeacherController';
import ClassController from './mvc/controllers/ClassController';
import InvitesController from './mvc/controllers/InvitesController';
import TestController from './mvc/controllers/TestController';
import PostsController from './mvc/controllers/PostController';

const routes = express.Router();
const userController = new UserController();
const teacherController = new TeacherController();
const classController = new ClassController();
const invitesController = new InvitesController();
const testController = new TestController();
const postsController = new PostsController();

// Post routes
routes.get('/post', postsController.index);
routes.get('/teacherPosts', postsController.getPosts);
routes.post('/post', postsController.create);

// Test route
routes.get('/test', testController.test);

// Teacher routes
routes.get('/teacher', teacherController.index);
routes.post('/teacher', teacherController.create);
routes.get('/teacher-login', teacherController.login);
routes.get('/getTeacher', teacherController.getTeacher);
routes.put('/updateTeacher', teacherController.updateTeacher);
routes.put('/updateSchedule', teacherController.updateSchedule);
routes.put('/updateScheduleItem', teacherController.updateScheduleItem);
routes.post('/teacher-avatar', teacherController.createAvatar);
routes.post('/favorite-teacher', teacherController.addFavorite);
routes.get('/favorite-teacher', teacherController.getFavorites);
routes.delete('/favorite-teacher', teacherController.deleteFavorite);

// User routes
routes.post('/user', userController.create);
routes.get('/user', userController.index);
routes.post('/forgot-password', userController.forgotPass);
routes.post('/reset-pass', userController.passReset);
routes.get('/getuser', userController.getUser);
routes.put('/updateuser', userController.updateUser);
routes.post('/avatar', userController.createAvatar);
routes.get('/avatar', userController.getImage);
routes.get('/favorite-user', userController.getUserFavorites);

// Class routes
routes.get('/class', classController.index);
routes.post('/class', classController.create);
routes.put('/class', classController.update);
routes.delete('/class', classController.delete);

// Invite routes
routes.post('/invite', invitesController.create);
routes.put('/invite', invitesController.accept); 
routes.get('/invite', invitesController.index);

export default routes;
