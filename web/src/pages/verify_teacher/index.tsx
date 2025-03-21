import styles from "./VerifyTeacher.module.css";
import Header from "../../components/header";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

function VerifyTeacher() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  async function verifyEmail() {
    try {
      await api.put(`/verify-teacher?token=${token}`).then((response) => {
        if (response.status === 200) {
          alert("Email verificado com sucesso!");
          navigate("/log_in_teacher");
        } else {
          alert("Token inválido!");
        }
      });
    } catch (err) {
      alert("Erro ao verificar email!");
      console.log(err);
    }
  }
  return (
    <div className={styles.verifyEmail}>
      <Header title="Verificação de Email" state={0} />
      <div className={styles.content}>
        <div id={styles.card}>
          <p>Clique aqui para verificar seu email:</p>
          <button onClick={verifyEmail}>Verificar email</button>
        </div>
      </div>
    </div>
  );
}

export default VerifyTeacher;
