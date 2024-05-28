import React, { useState, useEffect, MouseEventHandler } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Search from "../../assets/images/icons/search";
import TextBox from "../../components/textbox";
import Submit from "../../components/submit";
import api from "../../services/api";
import Button from "../../components/button";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")

function StudentArea() {
    return (
        <div>
            <Header title="Área do Aluno" path="/"/>
            <div id="area-container">
                <Link id="teacher-list" to="/teacher_list"> <Search/> Busque por professores</Link>
            </div>
            <Footer/>
        </div>
    )
}

export default StudentArea;