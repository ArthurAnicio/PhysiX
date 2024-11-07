import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ClassesArea.module.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ClassScheduleItem, { ClassSchedule } from "../../components/classScheduleItem";
import { Teacher } from '../../components/teacherItem';
import api from "../../services/api";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png");

function ClassesArea() {
    const location = useLocation();
    const { teacherId } = location.state || { teacherId: 0 };
    const [classSchedule, setClassSchedule] = useState<ClassSchedule[]>([]);
    const [showForm, setShowForm] = useState(false); 
    const [newClassSchedule, setNewClassSchedule] = useState({
        week_day: 0,
        from: '',
        to: '',
        id: 0
    });
    const [stateId, setStateId] = useState(teacherId)

    useEffect(() => {
        fetchClassSchedules();
    }, [location.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewClassSchedule(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    async function fetchClassSchedules() {
        try {
            const response = await api.get('/getTeacher', { params: { id: teacherId } });
            const currentTeacher = response.data;
    
            const schedule = JSON.parse(currentTeacher.schedule) || [];
    
            const orderedSchedule = schedule.sort((a:ClassSchedule, b:ClassSchedule) => {
                const dayComparison = a.week_day - b.week_day;
    
                if (dayComparison === 0) {
                    return a.from.localeCompare(b.from); 
                }
    
                return dayComparison; 
            });

            setClassSchedule(orderedSchedule);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    }

    function setNextId(array:ClassSchedule[]) {
        const ids = array.map(item => item.id);

        ids.sort((a, b) => a - b);
        
        for (let i = 0; i <= ids.length; i++) {
            if (ids[i] !== i) {
            return i;
            }
        }
        
        return ids.length;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            
            let currentId = 0
            
            if(classSchedule.length > 0) {
            currentId = setNextId(classSchedule)  
            } else {
            currentId = 0
            }

            

            const updatedSchedule = [...classSchedule, { ...newClassSchedule, id: currentId}];


            if(newClassSchedule.from>newClassSchedule.to) {
                alert("O horário de início não pode ser superior ao horario de fim!")
                return
            }

            const conflictClasses = classSchedule.filter((classSchedule) => classSchedule.from < newClassSchedule.from && classSchedule.to > newClassSchedule.from ||
             classSchedule.from < newClassSchedule.to && classSchedule.to > newClassSchedule.to ||
             newClassSchedule.from < classSchedule.to && newClassSchedule.to > classSchedule.to ||
             newClassSchedule.from < classSchedule.from && newClassSchedule.to > classSchedule.from)
            if (conflictClasses.length>0) {
                alert("Você não pode ter duas aulas no mesmo horário!")
                return
            }

            setClassSchedule(updatedSchedule);

            

            setNewClassSchedule({
                week_day: 0,
                from: '',
                to: '',
                id: 0
            });
            setShowForm(false); 
            const response = await api.put(`/updateSchedule?id=${teacherId}`, {
                schedule: JSON.stringify(updatedSchedule)   
            });
            fetchClassSchedules()

            
        } catch (error) {
            console.error('Error creating class schedule:', error);
        }
    };


    const removeClassSchedule = (id: number) => {
        setClassSchedule(prevSchedule => prevSchedule.filter(schedule => schedule.id !== id));
    };
    
    async function handleDelete(id: number) {
        removeClassSchedule(id);
    
        setClassSchedule((updatedSchedule) => {
            api.put(`/updateSchedule?id=${teacherId}`, {
                schedule: JSON.stringify(updatedSchedule),
            });
    
            return updatedSchedule;
        });
    }


    return (
        <div>
            <Header state={stateId} title="Suas Aulas" />
            <div id={styles.classesContainer}>
            
                {showForm && (
                    <form onSubmit={handleSubmit} id={styles.classesForm}>
                        <section>
                            <select
                                name="week_day"
                                value={newClassSchedule.week_day}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="0">Domingo</option>
                                <option value="1">Segunda-feira</option>
                                <option value="2">Terça-feira</option>
                                <option value="3">Quarta-feira</option>
                                <option value="4">Quinta-feira</option>
                                <option value="5">Sexta-feira</option>
                                <option value="6">Sábado</option>
                            </select>
                            <input
                                type="time"
                                name="from"
                                placeholder="De"
                                value={newClassSchedule.from}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="time"
                                name="to"
                                placeholder="Até"
                                value={newClassSchedule.to}
                                onChange={handleInputChange}
                                required
                            />
                        </section>
                        <button type="submit"><i className="fa-solid fa-plus"></i></button>
                    </form>
                )}
                {!showForm && (
                    <button  id={styles.add} onClick={() => setShowForm(true)}>Novo Horário</button>
                )}
                <div id={styles.schedulesDiv}>
                {classSchedule.map((schedule, index) => (
                    <ClassScheduleItem key={schedule.id} classSchedule={schedule} onDelete={handleDelete} teacherId={teacherId} />

                ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ClassesArea;
