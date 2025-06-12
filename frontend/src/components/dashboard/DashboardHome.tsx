import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Users, Calendar, TrendingUp, Ticket, MapPin, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { GetUpcomingEventsAPI } from "@/services/EventService";
import LoadingSpinner from "../project/LoadingSpinner";
import AlertMessage from "../project/AlertMessage";

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const stats = [
  { title: "Total Events", value: "12", icon: <Calendar className="w-6 h-6" /> },
  { title: "Total Attendees", value: "1,234", icon: <Users className="w-6 h-6" /> },
  { title: "Revenue", value: "$12,345", icon: <TrendingUp className="w-6 h-6" /> },
];

export default function DashboardHome() {
  const {data:upcomingEvents,isLoading,isError,error}=useQuery({
    queryKey:["upcomingEvents"],
    queryFn:GetUpcomingEventsAPI
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#050b2c]">Organizer Dashboard</h1>
        <Link
          to="/create-event"
          className="bg-[#ffa509] text-[#050b2c] px-4 py-2 rounded-lg hover:bg-[#ff9100] transition-colors text-sm font-medium flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white/10 backdrop-blur-xl border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-[#050b2c]">
                  {stat.value}
                </h3>
              </div>
              <div className="p-3 bg-[#ffa509]/10 rounded-full text-[#ffa509]">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-6 bg-white/10 backdrop-blur-xl border border-white/30">
        <h2 className="text-xl font-semibold text-[#050b2c] mb-4">
          Sales Overview
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#ffa509"
                fill="#ffa509"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Upcoming Events and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/10 backdrop-blur-xl border border-white/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#050b2c]">
              Upcoming Events
            </h2>
            <Link
              to="/events"
              className="text-[#ffa509] hover:text-[#ff9100] text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <LoadingSpinner />
            ) : isError ? (
              <AlertMessage type="error" message={(error as any)?.message} />
            ) : upcomingEvents?.events?.length === 0 ? (
              <AlertMessage type="info" message="No upcoming events" />
            ) : (
              upcomingEvents?.events?.map((event: any) => (
                <Card key={event._id} className="p-4 bg-white/5 border border-white/20">
                  <div className="flex items-start gap-4">
                    <img
                      src={event.images[0]?.url}
                      alt={event.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#050b2c]">{event.title}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#ffa509]" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#ffa509]" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#ffa509]" />
                          <span>{event.location.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[#ffa509] font-bold">${event.price}</span>
                      <Link to={`/events/${event._id}`} className="flex items-center gap-2 bg-[#ffa509] text-[#050b2c] hover:bg-[#ff9100] px-4 py-2 rounded-lg">
                        <Ticket className="w-4 h-4 mr-2" />
                        View Event
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6 bg-white/10 backdrop-blur-xl border border-white/30">
          <h2 className="text-xl font-semibold text-[#050b2c] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/create-event"
              className="h-auto bg-[#ffa509] text-[#050b2c] px-4 py-3 rounded-lg hover:bg-[#ff9100] transition-colors text-sm font-medium flex items-center text-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Link>
            <Link
              to="/events"
              className="h-auto bg-[#050b2c] text-white px-4 py-3 rounded-lg hover:bg-[#050b2c]/80 transition-colors text-sm font-medium flex items-center text-center justify-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Browse Events
            </Link>
            <Button variant="outline" className="h-auto py-3">
              <Users className="w-4 h-4 mr-2" />
              Manage Attendees
            </Button>
            <Button variant="outline" className="h-auto py-3">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button variant="outline" className="h-auto py-3">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}