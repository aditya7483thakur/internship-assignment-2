"use client";
// pages/login.js
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        username,
        password,
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      window.location.href = "/"; // Redirect to home page after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl text-white font-bold mb-6 text-center">
          Login
        </h1>
        <div className="mb-4">
          <label htmlFor="username" className="block text-white">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-white">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none"
        >
          Login
        </button>
      </div>
    </div>
  );
}
