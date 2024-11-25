import express from 'express';
import UserController from './mvc/controllers/UserController';
import TeacherController from './mvc/controllers/TeacherController';
import ClassController from './mvc/controllers/ClassController';
import InvitesController from './mvc/controllers/InvitesController';
import TestController from './mvc/controllers/TestController';
import PostsController from './mvc/controllers/PostController';
import ReplyController from './mvc/controllers/ReplyController';

const routes = express.Router();
const userController = new UserController();
const teacherController = new TeacherController();
const classController = new ClassController();
const invitesController = new InvitesController();
const testController = new TestController();
const postsController = new PostsController();
const replyController = new ReplyController();

//Reply Routes

routes.get('/replies', replyController.index);
routes.post('/reply', replyController.create);
routes.put('/likeReply', replyController.like);
routes.get('/likeReply', replyController.getLikes)


// Post routes
routes.get('/post', postsController.index);
routes.get('/teacherPosts', postsController.getPosts);
routes.get('/getUploads', postsController.getUpload);
routes.post('/post', postsController.create);
routes.put('/post', postsController.update);
routes.delete('/post', postsController.delete);
routes.get('/likePost', postsController.getLikes);
routes.put('/likePost', postsController.like);
routes.put('/replyPost', postsController.reply);

// Test route
routes.get('/test', testController.test);

// Teacher routes
routes.get('/teacher', teacherController.index);
routes.post('/teacher', teacherController.create);
routes.get('/teacher-login', teacherController.login);
routes.get('/getTeacher', teacherController.getTeacher);
routes.put('/updateTeacher', teacherController.updateTeacher);
routes.put('/updateTeacherPassword', teacherController.updateTeacherPassword);
routes.put('/updateSchedule', teacherController.updateSchedule);
routes.put('/updateScheduleItem', teacherController.updateScheduleItem);
routes.post('/teacher-avatar', teacherController.createAvatar);

// User routes
routes.post('/user', userController.create);
routes.get('/user', userController.index);
routes.post('/forgot-password', userController.forgotPass);
routes.post('/reset-pass', userController.passReset);
routes.get('/getuser', userController.getUser);
routes.put('/updateuser', userController.updateUser);
routes.put('/updateuserpassword', userController.updateUserPassword);
routes.post('/avatar', userController.createAvatar);
routes.get('/avatar', userController.getImage);
routes.get('/favorite-user', userController.getUserFavorites);

// Class routes


// Invite routes
routes.post('/invite', invitesController.create);
routes.put('/invite', invitesController.accept); 
routes.get('/invite', invitesController.index);
routes.delete('/invite', invitesController.delete);

export default routes;
