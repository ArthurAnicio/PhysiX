import express from 'express';
import UserController from './mvc/controllers/UserController';
import TeacherController from './mvc/controllers/TeacherController';
import ClassController from './mvc/controllers/ClassController';
import InvitesController from './mvc/controllers/InvitesController';
import TestController from './mvc/controllers/TestController';
import PostsController from './mvc/controllers/PostController';
import ReplyController from './mvc/controllers/ReplyController';
import MessageController from './mvc/controllers/MessageController';

const routes = express.Router();
const userController = new UserController();
const teacherController = new TeacherController();
const classController = new ClassController();
const invitesController = new InvitesController();
const testController = new TestController();
const postsController = new PostsController();
const replyController = new ReplyController();
const messageController = new MessageController();

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
routes.post('/verify-teacher', teacherController.sendEmail)
routes.put('/verify-teacher', teacherController.verifyEmail)

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
routes.post('/verify-email', userController.sendEmail)
routes.put('/verify-email', userController.verifyEmail)

// Class routes
routes.get('/classes', classController.index);
routes.post('/class', classController.create);
routes.get('/class', classController.getById);
routes.get('/classesUser', classController.getByUser);
routes.get('/classesTeacher',classController.getByTeacher);
routes.delete('/class', classController.delete);

// Invite routes
routes.post('/invite', invitesController.create);
routes.put('/invite', invitesController.accept); 
routes.get('/invite', invitesController.index);
routes.get('/inviteById', invitesController.getById)
routes.delete('/invite', invitesController.delete);

// Message routes
routes.post('/message', messageController.create);
routes.get('/messages', messageController.getAllMessagesByUserId);
routes.put('/message', messageController.updateType);
routes.delete('/message', messageController.delete);

export default routes;
