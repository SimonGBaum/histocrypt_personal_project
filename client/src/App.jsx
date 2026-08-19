import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "./utilities";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get("users/info/");
        setUser(response.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

    useEffect(() => {
    if (loading) {
      return;
    }
    if (!user && location.pathname !== "/") {
      navigate("/");
    }
    if (user && location.pathname === "/") {
      navigate("/home");
    }
  }, [user, loading, location.pathname, navigate]);

  return (
    <>
      <h1>HistoCrypt</h1>
      {loading || (!user && location.pathname !== "/") ? (
        <p>Loading...</p>
      ) : (
        <Outlet context={{ user, setUser }} />
      )}
    </>
  );
}
