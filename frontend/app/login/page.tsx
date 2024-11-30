"use client";

import "./styles.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try{
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const response_json = await response.json();
      if(response.ok){
        localStorage.setItem("token", response_json.token);
        router.push("/admin");
      }else{
        toast.error("Invalid username or password");
      }
    }catch(error){
      console.error("An unexpected error occurred:", error);
      alert("An unexpected error occurred");
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      <form onSubmit={handleSubmit} className="login-form">
      <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <ToastContainer  />
    </div>
  );
};

export default LoginPage;
