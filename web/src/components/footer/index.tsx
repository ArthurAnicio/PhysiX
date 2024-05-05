import "./styles.css";
import Insta from "../icons/insta";
import Xtt from "../icons/xtt";
import Face from "../icons/facebook";

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
