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
            const teacherId = location.state || 0;
            const response = await api.get('/class', { params: { teacherId } });
            setClassSchedule(response.data);
        }
        setUp();
    }, [location.state]);

    return (
        <div>
            <Header path="/" title="Suas Aulas" />
            <div id="classes-container">
                {
                    classSchedule.map((schedule) => {
                        return (
                            <ClassScheduleItem key={schedule.id} classSchedule={schedule} />
                        )
                    })
                }
            </div>
            <Footer />
        </div>
    )
}

export default ClassesArea;
