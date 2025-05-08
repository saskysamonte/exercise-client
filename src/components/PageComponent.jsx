import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Profile from "../views/Pages/Profile";
import classes from "./PageComponent.module.css";

export default function PageComponent({ page }) {
  const [activeMenu, setActiveMenu] = useState("basic");

  const menuItems = [
    { key: "basic", label: "Basic Details" },
    { key: "additional", label: "Additional Details" },
    { key: "spouse", label: "Spouse Details" },
    { key: "preferences", label: "Personal Preferences" },
  ];

  return (
    <div className={classes.pageWrapper}>
      <Header />
      <main className={classes.pageContainer}>
        <div className={classes.sidebarMenu}>
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.key}
                className={activeMenu === item.key ? classes.active : ""}
                onClick={() => setActiveMenu(item.key)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <div className={classes.pageContent}>
          {page === "profile" && <Profile activeMenu={activeMenu} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
