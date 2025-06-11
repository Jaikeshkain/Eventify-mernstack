
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { SiEventbrite } from "react-icons/si";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { logoutAction } from "@/Redux/slices/auth";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { LogoutAPI } from "@/services/UserService";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {

  const [isOpen, setIsOpen] = useState(false);

  const dispatch=useDispatch()
  const {userData}=useAuth()
  const navigate=useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const mutation = useMutation({
    mutationFn: LogoutAPI,
    mutationKey: ["logout"],
  });
  const handleLogout=()=>{
    mutation.mutateAsync();
    dispatch(logoutAction());
    navigate("/login");
  }

  return (
    <nav className="bg-[#050b2c] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex px-10">
            <Link to="/" className="flex items-center group">
              <SiEventbrite className="h-8 w-8 text-[#ffa509] group-hover:scale-110 transition-transform" />
              <span className="ml-2 text-xl font-bold text-white">
                Eventify
              </span>
            </Link>
            <div className="hidden md:flex md:items-center md:ml-10 space-x-4">
              <Link
                to="/events"
                className="text-gray-300 hover:text-[#ffa509] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Events
              </Link>
              {userData?.role === "organizer" && (
                <Link
                  to="/create-event"
                  className="text-gray-300 hover:text-[#ffa509] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Create Event
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {userData?.role === "organizer" ? (
              <>
                <Link
                  to="/dashboard/organizer"
                  className="text-gray-300 hover:text-[#ffa509] px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  <FaUserCircle className="h-5 w-5 mr-2" />
                  {userData?.username}
                </Link>
                <Button
                  onClick={handleLogout}
                  className="bg-[#ffa509] text-[#050b2c] px-4 py-2 rounded-lg hover:bg-[#ff9100] transition-colors text-sm font-medium"
                >
                  Logout
                </Button>
              </>
            ) : userData?.role === "attendee" ? (
              <>
                <Link
                  to="/dashboard/attendee"
                  className="text-gray-300 hover:text-[#ffa509] px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  <FaUserCircle className="h-5 w-5 mr-2" />
                  {userData?.username}
                </Link>
                <Button
                  onClick={handleLogout}
                  className="bg-[#ffa509] text-[#050b2c] px-4 py-2 rounded-lg hover:bg-[#ff9100] transition-colors text-sm font-medium"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-[#ffa509] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#ffa509] text-[#050b2c] px-4 py-2 rounded-lg hover:bg-[#ff9100] transition-colors text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-[#ffa509] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#ffa509] p-2"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-[#050b2c] border-t border-gray-700">
          <Link
            to="/events"
            className="text-gray-300 hover:text-[#ffa509] block px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Events
          </Link>

          {userData?.role === "organizer" && (
            <Link
              to="/create-event"
              className="text-gray-300 hover:text-[#ffa509] block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Create Event
            </Link>
          )}

          {userData?.role === "organizer" ? (
            <>
              <Link
                to="/dashboard/organizer"
                className="text-gray-300 hover:text-[#ffa509] block px-3 py-2 rounded-md text-base flex items-center font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FaUserCircle className="h-5 w-5 mr-2" />
                {userData?.username}
              </Link>
              <Button
                onClick={handleLogout}
                className="bg-[#ffa509] text-[#050b2c] block px-4 py-2 rounded-lg hover:bg-[#ff9100] transition-colors text-center font-medium"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-[#ffa509] block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#ffa509] text-[#050b2c] block px-4 py-2 rounded-lg hover:bg-[#ff9100] transition-colors text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
