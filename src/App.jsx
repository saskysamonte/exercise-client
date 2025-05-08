import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
  useNavigate,
} from "react-router-dom";

import { AuthProvider } from './store/auth-context';
import PageComponent from './components/PageComponent';
import Login from "./views/Auth/Login";
import NotFound from "./views/NotFound";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "./utils/auth.js";

function App() {
  const [accessToken, setAccessToken] = useState(() => Cookies.get("APP-ACCESS-TOKEN"));
  const [refreshToken, setRefreshToken] = useState(() => Cookies.get("APP-REFRESH-TOKEN"));

  useEffect(() => {
    const handleCookieChange = () => {
      setAccessToken(Cookies.get("APP-ACCESS-TOKEN"));
      setRefreshToken(Cookies.get("APP-REFRESH-TOKEN"));
    };

    window.addEventListener("storage", handleCookieChange);
    return () => window.removeEventListener("storage", handleCookieChange);
  }, []);

  return (
    <AuthProvider accessToken={accessToken} refreshToken={refreshToken}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/:page" element={<PageWrapper />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const PageWrapper = () => {
  const [refreshToken] = useState(localStorage.getItem("APP-REFRESH-TOKEN"));
  const { page } = useParams();
  const navigate = useNavigate();

  const validPages = ["home", "profile", "login", "register"]; 

  useEffect(() => {
    const token = Cookies.get("APP-ACCESS-TOKEN");

    if (validPages.includes(page)) {
      if (!token && page !== "register") {
        navigate("/login");
        return;
      }
    }

    if (token) {
      try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

              if (decodedToken.exp && decodedToken.exp < currentTime) {
                console.log('Token expired');

                if (refreshToken) {
                  refreshAccessToken(refreshToken)
                      .then(newAccessToken => {
                        Cookies.set("APP-ACCESS-TOKEN", newAccessToken, {
                          expires: 1 / 24, // 1 hour
                          secure: true,
                          sameSite: "Strict",
                          path: "/",
                        });
                        console.log("Access token refreshed");
                      })
                      .catch(error => {
                        console.error("Failed to refresh access token:", error);
                        Cookies.remove("APP-ACCESS-TOKEN");
                        Cookies.remove("APP-REFRESH-TOKEN");
                        Cookies.remove("APP-IS-LOGGED-IN");
                        navigate("/login");
                      });
                } else {
                    Cookies.remove("APP-ACCESS-TOKEN");
                    Cookies.remove("APP-REFRESH-TOKEN");
                    Cookies.remove("APP-IS-LOGGED-IN");
                    navigate("/login");
              }
        } 
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

  }, [page, navigate, refreshToken]);

  if (page === "login") {
    return <Login />;
  }

  if (page === "register") {
    return <Login />;
  }

  if (!validPages.includes(page)) {
    return <NotFound />;
  }

  
  return <PageComponent page={page}/>;
};

export default App;
