import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Button from '../../components/button';
import Header from '../../components/header';
import TeacherItem from '../../components/teacherItem';

function TeacherList(){
    return(
        <div>
            <Header path="/" title="Lista de Professores"/>
             <div id='teacherList-container'>
                
             </div>
        </div>
    )
};
export default TeacherList;