import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProilePhotoSelector from "../../components/inputs/ProilePhotoSelector";
import axiosInstance from "../../utils/axiosinsatnce";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email) {
      setError("Email cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!fullName) {
      setError("Please enter your name");
      setIsLoading(false);
      return;
    }
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


    try {
      // Upload image if present
      let profileImgUrl = "";
      if (profilePic) {
        const imageUploadRes = await uploadImage(profilePic);
        profileImgUrl = imageUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImgUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("sign up error :", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="glass-card w-full p-8">
        <div className="mb-6 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 text-sm">Join WalletIQ today</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <ProilePhotoSelector setImg={setProfilePic} />

          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
          />


          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{isLoading ? 'Creating account...' : 'Sign Up'}</span>
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700 underline decoration-2 decoration-violet-100 hover:decoration-violet-500 transition-all">
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
