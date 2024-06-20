import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./styles.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ClassScheduleItem, { ClassSchedule } from "../../components/classScheduleItem";
import api from "../../services/api";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png");

function ClassesArea() {
    const [classSchedule, setClassSchedule] = useState<ClassSchedule[]>([]);
    const location = useLocation();

    useEffect(() => {
        async function setUp() {
            const { id } = location.state || {};
            console.log('Fetching classes for teacher id:', id);
            try {
                const response = await api.get('/class', { params: { id } });
                console.log('Response data:', response.data);
                setClassSchedule(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        }
        setUp();
    }, [location.state]);

    useEffect(() => {
        console.log('Class schedule updated:', classSchedule);
    }, [classSchedule]);

    return (
        <div>
            <Header path="/" title="Suas Aulas" />
            <div id="classes-container">
                {
                    classSchedule.map((schedule, index) => {
                        console.log(`Rendering class schedule item ${index}:`, schedule);
                        return (
                            <ClassScheduleItem key={schedule.id} classSchedule={schedule} />
                        );
                    })
                }
            </div>
            <Footer />
        </div>
    );
}

export default ClassesArea;
