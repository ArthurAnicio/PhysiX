import Header from "../../components/header";
import Footer from "../../components/footer";
import "./styles.css"
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import TextBox from "../../components/textbox";
import Submit from "../../components/submit"

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")
function ResetPass() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const [password, setPassword] = useState('');
    const history = useNavigate();
    const [stateId, setStateId] = useState(0)

    localStorage.setItem("loginType", "0");

    async function passwordReset() {
        try {
            api.post('/reset-pass',{ 
                token: token, 
                password: password 
            })
            alert('Senha redefinida com sucesso! Redirecionando à página de login...')
            history('/log_in_student')
        }
        catch (error) {
            alert('Falha na redefinição de senha');
            console.log(error);
        }
    }
    return (
        <>
            <Header state={stateId} title="Redefinição de Senha" />
            <div id="reset-pass-container">
                <div id="reset-pass-window">
                    <header><img src={smlIcon} width="70px"/></header>
                    <h1>Coloque a nova senha para a sua conta</h1>
                    <TextBox type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                    <Submit label="Redefinir senha" onClick={passwordReset} className="btn"/>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default ResetPass;