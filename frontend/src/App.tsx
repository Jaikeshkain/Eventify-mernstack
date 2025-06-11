import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import CreateEvent from "@/pages/organizer-pages/CreateEvent";
import HomePage from "@/pages/public-pages/HomePage";
import Header from "@/components/project/header";
import EventsList from "@/pages/public-pages/EventsList";
import LoginPage from "@/pages/public-pages/LoginPage";
import RegisterPage from "@/pages/public-pages/RegisterPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";
import MyEvents from "./pages/organizer-pages/MyEvents";
import EventDetailsClient from "@/pages/public-pages/EventDetail";
import EditEvent from "@/pages/organizer-pages/EditEvent";
import TicketPurchase from "./pages/public-pages/TicketPurchase";
import TicketPaymentQR from "./pages/organizer-pages/PurchasePage";
import TicketListPage from "./pages/organizer-pages/TicketListPage";
import AttendeeDashboard from "./pages/attendee/AttendeeDashboard";

function AppWrapper() {
  const location = useLocation();

  // Hide Header if path starts with "/dashboard"
  const hideHeader = location.pathname.startsWith("/dashboard/organizer");

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events/:id" element={<EventDetailsClient />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
        <Route path="/events/:id/ticket-purchase" element={<TicketPurchase />} />
        <Route path="/payment/:price/:quantity/:eventName/:userId/:eventId" element={<TicketPaymentQR/>} />
        <Route path="/dashboard/attendee" element={<AttendeeDashboard />} />
        <Route path="/dashboard/organizer" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="events" element={<MyEvents />} />
          <Route path="analytics" element={<div>Analytics Page</div>} />
          <Route path="tickets" element={<TicketListPage />} />
          <Route path="ai-tools" element={<div>AI Tools Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
