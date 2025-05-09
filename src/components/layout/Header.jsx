import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import classes from "../../components/PageComponent.module.css";

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("app-is-logged-in");
    Cookies.remove("app-access-token");
    Cookies.remove("app-refresh-token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${classes.pageHeader}`)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  
  return (
    <header className={classes.pageHeader}>
      <div className={classes.headerLogo}>
          <h2>LOGO</h2>
      </div>
      <div className={classes.navbar} onClick={toggleMenu}>
        <span className="material-icons">
          {isMenuOpen ? "close" : "menu"} 
        </span>
      </div>

      <div className={`${classes.slideMenu} ${isMenuOpen ? classes.open : ""}`}>
        <ul className={classes.menuItems}>
          <li><a href="/">Home</a></li>
          <li><a href="/profile">My Profile</a></li>
          <li onClick={handleLogout} className={classes.logoutButton}>
            Logout
          </li>
        </ul>
      </div>
    </header>
  );
}
