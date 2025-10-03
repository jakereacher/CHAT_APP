import "../index.css"
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });

  const { signup, isSigningUp} = useAuthStore();

  const validateForm = () => {

      if (!formData.fullname.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (/\d/.test(formData.fullname)) {
    toast.error("Name cannot contain numbers");
    return false;
  }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
    toast.error("Please enter a valid email address");
    return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if(formData.password.length < 6){
      toast.error("Password must be atleast 6 characters")
      return false
    }
    // Add more validation as needed
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm()
    if(success===true) signup(formData)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        className="card w-full max-w-sm bg-base-100 shadow-lg rounded-xl p-6 space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-primary text-center mb-4">Create Account</h2>
        
        {/* Full Name */}
        <div className="form-control flex flex-col gap-2">
          <label htmlFor="fullname" className="label-text font-medium">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="input input-bordered input-primary"
            value={formData.fullname}
            onChange={e => setFormData({ ...formData, fullname: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="form-control flex flex-col gap-2">
          <label htmlFor="email" className="label-text font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="example@chat.com"
            className="input input-bordered input-primary"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="form-control flex flex-col gap-2">
          <label htmlFor="password" className="label-text font-medium">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="input input-bordered input-primary pr-12 w-full"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-primary"
              onClick={() => setShowPassword(show => !show)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full mt-4"
          disabled={isSigningUp}
        >
          {isSigningUp ? (
            <span className="loading loading-infinity loading-xl"></span>
          ) : "Create Account"}
        </button>
         {/* Switch to Login */}
        <div className="text-center text-sm mt-2">
          Already have an account?{" "}
          <Link to="/login" className="link text-primary font-semibold hover:underline cursor-pointer">
            Login
          </Link>
        </div>
      </form>
       
    </div>
  );
};

export default SignUpPage;
