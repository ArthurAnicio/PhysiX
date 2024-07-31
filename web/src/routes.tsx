import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import SignUpStudent from "./pages/sign_up_student";
import SignUpTeacher from "./pages/sign_up_teacher";
import LogInStudent from "./pages/login_student";
import LogInTeacher from "./pages/login_teacher";
import StudentArea from "./pages/student_area";
import TeacherArea from "./pages/teacher_area";
import TeacherList from "./pages/teacher_list";
import ForgotPassword from "./pages/forgot_password";
import ResetPass from "./pages/reset_pass";
import ClassesArea from "./pages/classes_area";
import StudentList from "./pages/student_list";


function RoutesWeb() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Landing} />
        <Route path="/sign_up_student" Component={SignUpStudent} />
        <Route path="/sign_up_teacher" Component={SignUpTeacher} />
        <Route path="/log_in_student" Component={LogInStudent} />
        <Route path="/log_in_teacher" Component={LogInTeacher} />
        <Route path="/student_area" Component={StudentArea} />
        <Route path="/teacher_area" Component={TeacherArea} />
        <Route path="/teacher_list" Component={TeacherList} />
        <Route path="/forgot_password" Component={ForgotPassword} />
        <Route path="/reset_pass" Component={ResetPass} />
        <Route path="/classes_area" Component={ClassesArea} />
        <Route path="/student_list" Component={StudentList} />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesWeb;
