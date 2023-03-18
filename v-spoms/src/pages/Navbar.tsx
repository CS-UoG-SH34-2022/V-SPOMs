import logo from "../assets/UofG_bar.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-dark-blue text-white items-stretch flex w-full min-w-1300">
      <div className="flex-1 ">
        <Link to="/">
          <img src={logo} alt="image_uofg" className="m-3 w-32" />
        </Link>
      </div>
      <div className="pr-3">
        <ul className="menu menu-horizontal gap-9 text-lg h-full">
          <li className="hover:bg-hover-blue">
            <Link to="/">
              <div>Home</div>
            </Link>
          </li>
          <li className="hover:bg-hover-blue">
            <Link to="/intro">
              <div>Introduction</div>
            </Link>
          </li>
          <li className="hover:bg-hover-blue">
            <Link to="/docs">
              <div>Docs</div>
            </Link>
          </li>
          <li className="hover:bg-hover-blue">
            <Link to="/credits">
              <div>Credits</div>
            </Link>
          </li>
          <li className="hover:bg-hover-blue">
            <Link to="/faq">
              <div>FAQ</div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
