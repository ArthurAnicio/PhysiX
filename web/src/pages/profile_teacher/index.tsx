import './styles.css'
import Header from "../../components/header";
import Footer from "../../components/footer";
import Submit from "../../components/submit";
import api from "../../services/api";
import Avatar from "../../components/avatar";
function ProfileTeacher () {
    return(
        <div>
            <Header title="Perfil do Professor" path="/" />
            <div id="area-container">
                <h1>Bem vindo, Professor!</h1>
            </div>
            <Footer />
        </div>
    )
}

export default ProfileTeacher;