import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utilities";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
  };

    const navigate = useNavigate();

    const readError = (err) => {
    const data = err.response?.data;

    if (!data) {
      return "Something went wrong. Please try again.";
    }
    if (data.detail) {
      return data.detail;
    }

    const firstField = Object.keys(data)[0];
    return data[firstField][0];
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("users/login/", {
        username: form.username,
        password: form.password,
      });
      navigate("/home");
    } catch (err) {
      setError(readError(err));
    }
  };

    const handleSignUp = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("users/register/", form);
      setForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
      });
      setIsLogin(true);
    } catch (err) {
      setError(readError(err));
    }
  };

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      <h2>{isLogin ? "Log In" : "Sign Up"}</h2>

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <input
            className="form-control"
            type="text"
            name="username"
            placeholder="Enter Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />
          <button className="btn btn-primary" type="submit">Log In</button>
        </form>
      ) : (
        <form onSubmit={handleSignUp}>
          <input
            className="form-control"
            type="text"
            name="first_name"
            placeholder="Enter first name"
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="text"
            name="last_name"
            placeholder="Enter last name"
            value={form.last_name}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="text"
            name="username"
            placeholder="Enter Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />
          <button className="btn btn-primary" type="submit">Sign Up</button>
        </form>
      )}

      <button className="btn btn-secondary" onClick={switchMode}>
        {isLogin ? "Do not have an account" : "Have an account"}
      </button>
    </>
  );
}
