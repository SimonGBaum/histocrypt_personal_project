import { useOutletContext } from "react-router-dom";

export default function HomePage() {
  const { user } = useOutletContext();

  return (
    <>
      <p>{user.username}</p>
      <h2>Home Page</h2>
    </>
  );
}
