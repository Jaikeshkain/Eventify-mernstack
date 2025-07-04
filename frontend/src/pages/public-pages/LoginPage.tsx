import React, { useEffect } from "react";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { SiEventbrite } from "react-icons/si";
import { useMutation } from "@tanstack/react-query";
import { LoginAPI } from "@/services/UserService";
import { useDispatch } from "react-redux";
import { loginAction } from "@/Redux/slices/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const dispatch=useDispatch()
  const mutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      LoginAPI(credentials.email, credentials.password),
    mutationKey: ["login"],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    mutation.mutateAsync({email,password}).then((data) => {
      dispatch(loginAction({ id: data.user._id, token: data.user.token }));
      localStorage.setItem("USER_INFO",JSON.stringify({id:data.user._id,token:data.user.token}))
      navigate("/")
    }).catch((error) => {
      console.log(error);
    }).finally(()=>{
      setIsLoading(false)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050b2c] to-[#1a237e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-[#ffa509] p-4 rounded-2xl">
                <SiEventbrite className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-[#050b2c]">
              Welcome Back!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-[#ffa509] hover:text-[#ff9100] transition-colors"
              >
                Sign up now
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
                <p className="text-yellow-700">Logging in...</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-[#ffa509]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-[#ffa509]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffa509] focus:border-transparent transition-all"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  "Sign in"
                )}
              </button>
            </div>

            <div className="flex items-center justify-center">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-[#ffa509] transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
