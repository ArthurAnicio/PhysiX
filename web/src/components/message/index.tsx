import styles from "./Message.module.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";

interface MessageItem {
  id: number;
  teacher_id: number;
  user_id: number;
  message: string;
  type: string;
  price: string;
}

interface MessageProps {
  message: MessageItem;
  sync: () => void;
}

const Message: React.FC<MessageProps> = ({ message, sync }) => {
  const [avatar, setAvatar] = useState("");
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    id: 0,
    avatar: "",
    number: "",
    password: "",
    schedule: null,
  });
  const [isRefused, setIsRefused] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    getTeacher();
  }, []);

  useEffect(() => {
    if (teacher.avatar) {
      getAvatar(teacher.avatar);
    }
  }, [teacher.avatar]);

  useEffect(() => {
    if (message.type === "recusado") {
      setIsRefused(true);
      setIsPaying(false);
    } else if (message.type === "aceito") {
      setIsRefused(false);
    }
  });

  async function getTeacher() {
    try {
      const response = await api.get("/getTeacher", {
        params: { id: message.teacher_id },
      });
      if (response.status === 200) {
        setTeacher(response.data);
      } else {
        alert("Falha.");
      }
    } catch (error) {
      console.log(error);
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

  async function apagar() {
    try {
      console.log("id da mensagem enviado:" + message.id);
      const response = await api.delete(`/message?id=${message.id}`);
      if (response.status === 200) {
        sync();
      } else {
        alert("Falha ao apagar!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function pagar() {
    setIsPaying(false);
    try {
      const response = await api.post("/class", {
        teacher_id: message.teacher_id,
        user_id: message.user_id,
      });
      if (response.status === 200) {
        apagar();
        alert("Pagamento realizado com sucesso!");
      } else {
        alert("Falha ao pagar!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.message}>
      <div className={styles.teacher}>
        <div id={styles.avatar}>
          <img src={avatar} alt={teacher.name} />
        </div>
        <label>{teacher.name}</label>
      </div>
      {isRefused ? (
        <div className={styles.recusado}>
          <label>{message.message}</label>
        </div>
      ) : (
        <div className={styles.aceito}>
          <label>{message.message}</label>
          <label>Valor da aula é {message.price}</label>
          <button
            onClick={() => setIsPaying(!isPaying)}
            className={styles.pagar}
          >
            Inserir Cartão
          </button>
        </div>
      )}
      {isPaying && (
        <div className={styles.pagando}>
          <label>Número:</label>
          <input type="text" />
          <button onClick={pagar}>Pagar</button>
        </div>
      )}
      <div onClick={apagar}>
        <label className={styles.apagar}>Recusar</label>
      </div>
    </div>
  );
};

export default Message;
