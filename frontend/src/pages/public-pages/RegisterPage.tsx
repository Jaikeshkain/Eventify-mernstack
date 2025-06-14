import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaUserTag } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import { RegisterAPI } from "@/services/UserService";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();  

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
  const mutation = useMutation({
    mutationFn: ()=>RegisterAPI(formData.username,formData.email,formData.role,formData.password,formData.confirmPassword),
    mutationKey: ["register"],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev)=>({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    mutation.mutateAsync().then(()=>{
      navigate("/login");
    }).catch((error)=>{
      console.log(error);
    }).finally(()=>{
      setIsLoading(false);
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050b2c] to-[#1a237e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-[#ffa509] p-4 rounded-2xl">
                <BiBuildingHouse className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-[#050b2c]">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#ffa509] hover:text-[#ff9100] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {mutation.isError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                <p className="text-red-700">{mutation.error.message}</p>
              </div>
            )}
            {mutation.isSuccess && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-xl">
                <p className="text-green-700">{mutation.data.message}</p>
              </div>
            )}
            {mutation.isPending && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl">
                <p className="text-yellow-700">Registering...</p>
              </div>
            )}
            <div className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-[#ffa509]" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Full Name"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-[#ffa509]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Role Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserTag className="h-5 w-5 text-[#ffa509]" />
                </div>
                <input
                  id="role"
                  name="role"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Role (Attendee, Organizer)"
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-[#ffa509]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-[#ffa509]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-[#050b2c] to-[#0a1854] hover:from-[#0a1854] hover:to-[#050b2c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffa509] font-medium transition-all duration-300"
              >
                {isLoading ? (
                  <FaSpinner className="h-5 w-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              By signing up, you agree to our{" "}
              <Link
                to="/terms"
                className="text-[#ffa509] hover:text-[#ff9100] transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-[#ffa509] hover:text-[#ff9100] transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
