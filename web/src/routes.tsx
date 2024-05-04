import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import LogInStudent from "./pages/log_in_student";
import LogInTeacher from "./pages/log_in_teacher";
import TeacherList from "./pages/teacher_list";

function RoutesWeb() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Landing} />
        <Route path="/log_in_student" Component={LogInStudent} />
        <Route path="/log_in_teacher" Component={LogInTeacher} />
        <Route path="/teacher_list" Component={TeacherList} />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesWeb;
