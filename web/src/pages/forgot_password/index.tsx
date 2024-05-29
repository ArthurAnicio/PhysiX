import Header from "../../components/header";
import Footer from "../../components/footer";
import TextBox from "../../components/textbox";
import { useState } from "react";
import "./styles.css"
import { Link } from "react-router-dom";
import Submit from "../../components/submit";
import axios from "axios";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")
function ForgotPassword() {
    const [email, setEmail] = useState("")

    async function sendEmail() {
        try {
            await axios.get('/forgot-password',{
                params: {
                    email: email
                }
            });
            alert("Email enviado com sucesso!");
        }
        catch (err) {
            alert("Erro no envio!")
            console.log(err);
        }
    }
    return (
        <>
            <Header path="/" title="Esqueci a senha"/>
            <div id="password-container">
                <div id="password-window">
                    <header><img src={smlIcon} width="70px"/></header>
                    <h2>Esqueceu sua senha? Sem problemas!</h2>
                    <p>Digite seu email, e nós iremos te enviar um link para você redefinir a sua senha!</p>
                    <TextBox type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                    <Link to="/log_in_student" id="login-return">Voltar para a página de login</Link>
                    <Submit label="Enviar email" className="btn" onClick={sendEmail}/>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default ForgotPassword;