import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import Button from "../../components/button";

function LogInStudent() {
  return (
    <div>
      <h1>Sign Up Student</h1>
      <Button label="Sou estudante" path="/log_in_student" />
      <Button label="Sou professor" path="/log_in_teacher" />
      <Button label="Estude" path="/teacher_list" />
      <Button label="Início" path="/" />
    </div>
  );
}
export default LogInStudent;
