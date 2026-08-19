import { Link, useOutletContext } from "react-router-dom";
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
      <Link className="btn btn-primary" to="/game">
        Game
      </Link>
      <Link className="btn btn-primary" to="/user">
        User Area
      </Link>
      <button className="btn btn-secondary" onClick={handleLogOut}>
        Log Out
      </button>
    </>
  );
}
