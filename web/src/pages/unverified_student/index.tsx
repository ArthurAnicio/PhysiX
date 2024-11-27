import styles from './Unverified.module.css' 
import Header from '../../components/header'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../services/api'

function UnverifiedStudent() {
    const [canReqAgain, setCanReqAgain] = useState(true)
    const location = useLocation()
    const {email} = location.state || ''
    async function handleSendEmail() {
        if (canReqAgain) {
            try {
                await api.post('/verify-email', {email}).then(() => {
                  alert('Email re-enviado!');
                })} catch (err) {
                  alert('Erro ao enviar email!');
                  console.log(err);
                }
            setCanReqAgain(false)
            window.setTimeout(() => setCanReqAgain(true), 30000)
        } else {
            alert('Aguarde 30 segundos para enviar novamente um email.')
        }
    }
    return (
        <div className={styles.unverified}>
            <Header state={0} title=''/>
            <h1>Você ainda não confirmou seu e-mail.</h1>
            <p>Por favor, verifique seu e-mail para confirmar sua conta.</p>
            <button onClick={handleSendEmail}>Clique aqui para enviar novamente o e-mail de verificação</button>
        </div>
    )
}

export default UnverifiedStudent