import styles from "./Invites.module.css";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Invite from "../../components/invite";
import React, { useState, useEffect, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

interface Schedule {
  week_day: string;
  from: string;
  to: string;
  id: number;
}

interface InviteItem {
  id: number;
  user_id: number;
  teacher_id: number;
  accepted: boolean;
  schedule: string;
}

function Invites() {
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    id: 0,
    avatar: "",
    number: "",
    password: "",
    schedule: null,
  });
  const [invites, setInvites] = useState<InviteItem[]>([]);
  const [invitesFiltered, setInvitesFiltered] = useState<InviteItem[]>([]);
  const [invite, setInvite] = useState<InviteItem>();
  const location = useLocation();
  const navigate = useNavigate();
  const { teacherId } = location.state || { teacherId: 0 };
  const [stateId, setStateId] = useState(teacherId);

  useEffect(() => {
    getTeacher();
  }, [teacherId]);

  useEffect(() => {
    fetchInvites();
  }, []);

  useEffect(() => {
    console.log(
      invites.filter((invite: InviteItem) => invite.accepted == false)
    );
    setInvitesFiltered(
      invites.filter((invite: InviteItem) => invite.accepted == false)
    );
  }, [invites]);

  async function getTeacher() {
    try {
      const response = await api.get("/getTeacher", {
        params: { id: teacherId },
      });
      if (response.status === 200) {
        console.log(response.data);
        setTeacher(response.data);
        setStateId(response.data.id);
      } else {
        alert("Falha no login! Por favor tente novamente.");
        navigate("/log_in_teacher");
      }
    } catch (error) {
      alert("Falha no login!");
      navigate("/log_in_teacher");
      console.log(error);
    }
  }

  async function fetchInvites() {
    try {
      api.get(`/invite?teacher_id=${teacherId}`).then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setInvites(response.data);
        } else {
          alert("Falha no login! Por favor tente novamente.");
          navigate("/log_in_teacher");
        }
      });
    } catch (error) {
      alert("Falha no login!");
      navigate("/log_in_teacher");
      console.log(error);
    }
  }

  return (
    <div>
      <Header state={stateId} title="Pedidos de aula" />
      <main className={styles.content}>
        {invitesFiltered.map((invite: InviteItem) => (
          <Invite key={invite.id} invite={invite} sync={fetchInvites} />
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default Invites;
