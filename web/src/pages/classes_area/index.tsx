import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./styles.css";
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
        week_day: '',
        from: '',
        to: ''
    });
    const [stateId, setStateId] = useState(teacherId)

    useEffect(() => {
        async function fetchClassSchedules() {
            try {
                const response = await api.get('/teacher');
                const currentTeacher = response.data
                setClassSchedule(currentTeacher);
                console.log(classSchedule)
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        }
        fetchClassSchedules();
    }, [location.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewClassSchedule(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { id } = location.state || {};
            const response = await api.post('/class', {
                ...newClassSchedule,
                class_id: teacherId,
            });
            setClassSchedule([...classSchedule, response.data]);
            setNewClassSchedule({
                week_day: '',
                from: '',
                to: ''
            });
            setShowForm(false); // Esconde o formulário após a criação da classSchedule
        } catch (error) {
            console.error('Error creating class schedule:', error);
        }
    };
    const removeClassSchedule = (id: number) => {
        setClassSchedule(classSchedule.filter(schedule => schedule.id !== id));
    };

    const handleDelete = (id: number) => {
        api.delete(`/class?id=${id}`)
            .then(res => {
                removeClassSchedule(id);
            })
            .catch(err => {
                console.log(err);
            });
    };


    return (
        <div>
            <Header state={stateId} title="Suas Aulas" />
            <div id="classes-container">
                {classSchedule.map((schedule, index) => (
                    <ClassScheduleItem key={schedule.id} classSchedule={schedule} onDelete={handleDelete} />

                ))}
                {showForm && (
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit">+</button>
                    </form>
                )}
                {!showForm && (
                    <button  id="add" onClick={() => setShowForm(true)}>Novo Horário</button>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default ClassesArea;
