import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landding from "./pages/landding";
import SignUpStudent from "./pages/sign-up-student";
import SignUpTeacher from "./pages/sign-up-teacher";
import TeacherList from "./pages/teacher-list";

function RoutesWeb(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Landding} />
                <Route path="/sign_up_student" Component={SignUpStudent}/>
                <Route path="/sign_up_teacher" Component={SignUpTeacher}/>
                <Route path="/teacher_list" Component={TeacherList}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesWeb;