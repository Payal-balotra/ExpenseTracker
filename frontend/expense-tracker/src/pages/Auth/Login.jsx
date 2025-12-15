import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosinsatnce";
import { UserContext } from "../../context/UserContext";

// AuthLayout Component
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      if (!token) {
        setError("Login failed: no token returned");
        return;
      }
      localStorage.setItem("token", token);
      updateUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="glass-card w-full p-8 md:p-10">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"/>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full mt-4"
            disabled={isLoading}
          >
             {isLoading ? "Signing in..." : "LOGIN"}
          </button>

          <p className="text-slate-500 text-sm text-center mt-6">
            Don't have an account?
            <Link
              to="/signup"
              className="text-violet-600 font-semibold hover:text-violet-700 ml-1 underline decoration-2 decoration-violet-100 hover:decoration-violet-500 transition-all"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
