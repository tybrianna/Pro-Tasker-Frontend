import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] =
    useState<RegisterForm>({
      name: "",
      email: "",
      password: "",
    });

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/auth/register",
        form
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

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
              password: e.target.value,
            })
          }
        />

        <button type="submit">
          Register
        </button>
      </form>

      <p>
        Already have an account?
        <Link to="/login">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;