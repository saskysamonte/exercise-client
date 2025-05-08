import React, {} from "react";
import classes from "./HomePage.module.css";

export default function HomePage() {
    return (
        <div className={classes.HomePageWrapper}>
            <div className={classes.HomePageContainer}>
                <h1>Homepage</h1>
                <p>Welcome to MyApp!</p>
                <div className={classes.links}>
                    <a href="/login" className={classes.loginLink}>
                        Login
                    </a>
                    <a href="/register" className={classes.registerLink}>
                        Register
                    </a>
                </div>
            </div>
        </div>
    );
};