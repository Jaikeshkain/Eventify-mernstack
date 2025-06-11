import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  Ticket, 
  Bot, 
  Settings,
  Menu,
  X,
  LogOut,
  Search
} from "lucide-react";
import { Button } from "../ui/button";
import { logoutAction } from "@/Redux/slices/auth";
import { useDispatch } from "react-redux";
import NotAdmin from "../project/auth/NotAdmin";
import { useAuth } from "@/context/AuthContext";
import { LogoutAPI } from "@/services/UserService";
import { useMutation } from "@tanstack/react-query";

const menuItems = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/dashboard/organizer" },
  { icon: <Calendar className="w-5 h-5" />, label: "My Events", path: "/dashboard/organizer/events" },
  { icon: <Search className="w-5 h-5" />, label: "Browse Events", path: "/events" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", path: "/dashboard/organizer/analytics" },
  { icon: <Ticket className="w-5 h-5" />, label: "Tickets", path: "/dashboard/organizer/tickets" },
  { icon: <Bot className="w-5 h-5" />, label: "AI Tools", path: "/dashboard/organizer/ai-tools" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/dashboard/organizer/settings" },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {userData}=useAuth()
  const dispatch=useDispatch()
  const navigate=useNavigate()
    const mutation = useMutation({
    mutationFn: LogoutAPI,
    mutationKey: ["logout"],
  });
  const handleLogout=()=>{
    mutation.mutateAsync();
    dispatch(logoutAction(null));
    navigate("/login");
  }

    if (userData?.role !== "organizer") {
      return <NotAdmin userData={userData} />;
    }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-[#050b2c] text-white hover:bg-[#0a1a4d]"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#050b2c] text-white transform transition-transform duration-200 ease-in-out z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-[#ffa509]">Eventify</Link>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-[#0a1a4d] hover:text-[#ffa509] transition-colors"
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-full p-6">
          <Button variant="ghost" className="w-full hover:bg-red-500 hover:text-white" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`lg:ml-64 min-h-screen transition-all duration-200 ease-in-out p-6`}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 