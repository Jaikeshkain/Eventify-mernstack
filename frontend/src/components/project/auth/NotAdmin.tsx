import { FaLock } from "react-icons/fa";

const NotAdmin = () => {
    return (
      <div className="min-h-[100vh] bg-gradient-to-br from-[#050b2c] to-[#0a1854] flex items-center justify-center px-4 py-12">
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffa509]/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffa509]/20 rounded-full blur-3xl -z-10"></div>
          <div className="max-w-lg w-full backdrop-blur-lg bg-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-[#ffa509]/20 p-4 rounded-xl">
                  <FaLock className="text-[#ffa509] w-12 h-12" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Access Denied
              </h1>
              <p className="text-gray-300 text-lg">
                You are not an authorized organizer.<br />
                Please contact support if you believe this is a mistake.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  
  
};

export default NotAdmin;
