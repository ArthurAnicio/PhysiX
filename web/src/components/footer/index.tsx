import "./styles.css";
import Insta from "../../assets/images/icons/insta";
import Xtt from "../../assets/images/icons//xtt";
import Face from "../../assets/images/icons//facebook";

function Footer() {
  return (
    <footer>
      <p>PhysiX</p>
      <ul>
        <li>
          <a href="/">
            <Insta />
            <span>Instagram</span>
          </a>
        </li>
        <li>
          <a href="/">
            <Xtt />
            <span>X (Twitter)</span>
          </a>
        </li>
        <li>
          <a href="/">
            <Face />
            <span>Facebook</span>
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
