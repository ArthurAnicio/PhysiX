import Header from "../../components/header";
import Footer from "../../components/footer";
import { useState } from "react";

const smlIcon = require("../../assets/images/imgs/pequenoClaroPng.png")
function ResetPass() {
    return (
        <>
            <Header path="/" title="Redefinição de Senha" />
            <div id="reset-pass-container">
                <div id="reset-pass-window">
                    <header><img src={smlIcon} width="70px"/></header>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default ResetPass;