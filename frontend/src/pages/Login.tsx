import {
  useState,
  FormEvent,
  type FormEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../services/api";

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState<LoginForm>({
      email: "",
      password: "",
    });

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    const res =
      await API.post(
        "/auth/login",
        form
      );

    localStorage.setItem(
      "token",
      res.data.token
    );

    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({
            ...form,
            password:
              e.target.value,
          })
        }
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
}

export default Login;