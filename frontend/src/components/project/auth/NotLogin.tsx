import { FaLock, FaSignInAlt, FaUserPlus, FaHome } from "react-icons/fa";
import { MdRealEstateAgent } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const NotLogin=()=>{
    const navigate=useNavigate();
  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-[#050b2c] to-[#0a1854] flex items-center justify-center px-4 py-12">
      <div className="relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffa509]/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffa509]/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-lg w-full backdrop-blur-lg bg-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
          {/* Icon and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-[#ffa509]/20 p-4 rounded-xl">
                <FaLock className="text-[#ffa509] w-12 h-12" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Are you ready to start?
            </h1>
            <p className="text-gray-300 text-lg">
              Please login to start your journey.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#ffa509] hover:bg-[#ff9100] text-[#050b2c] py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <FaSignInAlt className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go to Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <FaUserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Create an Account
            </button>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-[#ffa509]/20 p-2 rounded-lg">
                <MdRealEstateAgent className="text-[#ffa509] w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Professional Listing
                </h3>
                <p className="text-gray-300 text-sm">
                  Showcase your event with high-quality listings
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-[#ffa509]/20 p-2 rounded-lg">
                <FaHome className="text-[#ffa509] w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Wide Reach</h3>
                <p className="text-gray-300 text-sm">
                  Connect with thousands of potential Attendees
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotLogin;
