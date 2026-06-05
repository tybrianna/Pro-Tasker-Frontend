import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    await register(name, email, password);
    nav("/");
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl mb-4">Register</h1>

      <input className="p-2 m-2" placeholder="Name" onChange={e => setName(e.target.value)} />
      <input className="p-2 m-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="p-2 m-2" placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />

      <button className="bg-green-500 text-white p-2" onClick={submit}>
        Create Account
      </button>
    </div>
  );
}