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
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError("Password cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }
   console.log(BASE_URL)
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      let errorMessage = "We couldn’t log you in. Please try again.";

      if (
        err?.response?.status === 404 ||
        err?.response?.data?.message?.toLowerCase().includes("user not found")
      ) {
        errorMessage = "You don’t have an account. Please sign up.";
      } else if (
        err?.response?.status === 401 ||
        err?.response?.data?.message?.toLowerCase().includes("invalid password")
      ) {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err?.response?.status === 400) {
        errorMessage = "Invalid request. Please check your details.";
      } else if (err?.response?.status >= 500) {
        errorMessage =
          "Server is not responding right now. Please try again later.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Log in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 w-full">
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
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full text-sm font-medium text-white bg-violet-500 shadow-lg shadow-purple-600/5 p-[10px] rounded-md my-1 hover:bg-purple-600/15 hover:text-purple-600"
            >
              LOGIN
            </button>

            <p className="text-gray-500 text-sm">
              Don't have an account?
              <Link
                to="/signup"
                className="text-violet-600 hover:text-violet-700 p-2"
              >
             <u>SignUp</u> 
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
