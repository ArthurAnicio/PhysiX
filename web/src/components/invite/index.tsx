import styles from "./Invite.module.css";
import api from "../../services/api";
import { InputHTMLAttributes, useState, useEffect } from "react";

interface Invite {
  id: number;
  user_id: number;
  teacher_id: number;
  accepted: boolean;
  schedule: string;
}

interface InviteProps extends InputHTMLAttributes<HTMLInputElement> {
  invite: Invite;
  sync: () => void;
}

interface Schedule {
  week_day: string;
  from: string;
  to: string;
  id: number;
}

const Invite: React.FC<InviteProps> = ({ invite, sync }) => {
  const [user, setUser] = useState({ id: 0, name: "", avatar: "" });
  const [avatar, setAvatar] = useState("");
  const [schedule, setSchedule] = useState<Schedule>(
    JSON.parse(invite.schedule)
  );
  const [value, setValue] = useState<number>();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user.avatar) {
      getAvatar(user.avatar);
    }
  }, [user.avatar]);

  useEffect(() => {
    formatSchedule();
  }, []);

  async function getUser() {
    const response = await api.get(`/getuser?id=${invite.user_id}`);
    if (response.status === 200) {
      setUser(response.data);
    }
  }

  async function getAvatar(avatarPath: string) {
    try {
      const response = await api.get("/avatar", {
        params: { route: avatarPath },
      });
      if (response.status === 200) {
        setAvatar(response.request.responseURL);
      } else {
        alert("Falha no avatar!");
        console.log(response);
      }
    } catch (err) {
      alert("Falha no avatar!");
      console.log(err);
    }
  }

  function formatSchedule() {
    switch (schedule.week_day) {
      case "0":
        return setSchedule({
          week_day: "Domingo",
          from: schedule.from,
          to: schedule.to,
          id: schedule.id,
        });
      case "1":
        return setSchedule({
          week_day: "Segunda",
          from: schedule.from,
          to: schedule.to,
          id: schedule.id,
        });
      case "2":
        return setSchedule({
          week_day: "Terça",
          from: schedule.from,
          to: schedule.to,
          id: schedule.id,
        });
      case "3":
        return setSchedule({
          week_day: "Quarta",
          from: schedule.from,
          to: schedule.to,
          id: schedule.id,
        });
      case "4":
        return setSchedule({
          week_day: "Quinta",
          from: schedule.from,
          to: schedule.to,
          id: schedule.id,
        });
      case "5":
        return setSchedule({
          week_day: "Sexta",
          from: schedule.from,
          to: schedule.to,
          id: schedule.id,
        });
      case "6":
        return setSchedule({
          week_day: "Sábado",
          from: schedule.from,
          to: schedule.to,
          id: schedule.id,
        });
      default:
        return "";
    }
  }

  async function refuse() {
    const response = await api.delete(`/invite?id=${invite.id}`);
    const message = await api.post(`/message`, {
      user_id: invite.user_id,
      teacher_id: invite.teacher_id,
      message: "Solicitação recusado",
      type: "recusado",
      price: "",
      invite_id: invite.id,
    });
    if (response.status === 200) {
      sync();
    } else {
      alert("Falha ao recusar solicitação.");
      console.log(response);
    }
  }

  async function accept() {
    api.get(`/getTeacher?id=${invite.teacher_id}`).then((response) => {
      const newSchedule = JSON.parse(response.data.schedule).filter(
        (item: Schedule) => item.id != schedule.id
      );
      api.put(`updateSchedule?id=${invite.teacher_id}`, {
        schedule: JSON.stringify(newSchedule),
      });
      api
        .put(`/invite`, {
          id: invite.id,
          teacher_id: invite.teacher_id,
          schedule: newSchedule,
        })
        .then((response) => {
          api
            .post("/message", {
              user_id: invite.user_id,
              teacher_id: invite.teacher_id,
              invite_id: invite.id,
              message: "Solicitação aceito",
              type: "aceito",
              price: `R$${value}`,
            })
            .then((response) => {
              sync();
            });
        });
    });
  }

  return (
    <div className={styles.invite}>
      <div id={styles.mainContent}>
        <div className={styles.perfil}>
          <img className={styles.foto} src={avatar} alt="" />
          <div className={styles.nome}>{user.name.split(" ")[0]}</div>
        </div>
        <div className={styles.agenda}>
          <label className={styles.diaSemana}>{schedule.week_day}</label>
          <div className={styles.horario}>
            <label className={styles.time}>De: {schedule.from}</label>
            <label className={styles.time}>Até: {schedule.to}</label>
          </div>
        </div>
        <div className={styles.botoes}>
          <div className={styles.actions}>
            <div className={styles.aceitar} onClick={accept}>
              <i className="fa-solid fa-check"></i>
            </div>
            <div className={styles.recusar} onClick={refuse}>
              <i className="fa-solid fa-times"></i>
            </div>
          </div>
        </div>
      </div>
      <div id={styles.value}>
        <label>Insira o valor cobrado por essa aula:</label>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            setValue(parseInt(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

export default Invite;
