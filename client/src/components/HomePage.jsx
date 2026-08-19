import { useOutletContext } from "react-router-dom";
import api from "../utilities";

export default function HomePage() {
  const { user, setUser } = useOutletContext();

  const handleLogOut = async () => {
    try {
      await api.post("users/logout/");
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <p>{user.username}</p>
      <h2>Home Page</h2>
      <button className="btn btn-secondary" onClick={handleLogOut}>
        Log Out
      </button>
    </>
  );
}
