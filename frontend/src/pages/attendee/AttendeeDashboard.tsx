import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCodeSVG from "react-qr-code";
import { BiCalendar, BiMap, BiDownload, BiTime } from "react-icons/bi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getTicketsForAttendee } from "@/services/TicketService";
import { useAuth } from "@/context/AuthContext";
import NotAdmin from "@/components/project/auth/NotAdmin";

interface Ticket {
  _id: string;
  event: any;
  user: any;
  qrCode: string;
  status: "booked" | "cancelled" | "pending" | "expired";
  qrGeneration: any;
}

// Glassmorphism classes
const glassCard =
  "bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]";
const glassInner =
  "bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-inner border border-white/10";
const glassTabs =
  "bg-white/10 backdrop-blur-xl border border-white/30 rounded-full shadow-sm";
const glassBadge =
  "bg-white/30 backdrop-blur-md border border-white/50 text-white shadow-md";
const glassButton =
  "bg-gradient-to-br from-[#ff8c00]/70 to-[#ffa500]/70 text-white shadow-md hover:from-[#ffa500] hover:to-[#ff8c00]";

const getStatusColor = (status: Ticket["status"]) => {
  switch (status) {
    case "booked":
      return "bg-blue-500/80";
    case "cancelled":
      return "bg-green-500/80";
    case "pending":
      return "bg-red-500/80";
    default:
      return "bg-gray-400/80";
  }
};

export default function AttendeeDashboard() {
  

  const {token,userData}=useAuth()
  const [ticketData,setTicketData]=useState<Ticket[]>([])
  const {data}=useQuery({
    queryKey:["tickets"],
    queryFn:()=>getTicketsForAttendee(token as string)
  })

  useEffect(()=>{
    if(data){
      setTicketData(data.tickets)
    }
  },[data])
  console.log(ticketData)
  
  if(userData?.role!=="attendee"){
    return <NotAdmin />
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2d] via-[#101c45] to-[#050b2c] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-12"
        >
          <div className={`${glassCard} px-10 py-8`}>
            <h1 className="text-4xl font-extrabold text-white mb-1 drop-shadow">
              Welcome, {userData?.username}
            </h1>
            <p className="text-lg text-white/70">Your Events Dashboard</p>
          </div>
        </motion.div>

        {/* Tabs and Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="tickets" className="space-y-8">
            <TabsList
              className={`${glassTabs} flex justify-center gap-2 px-4 py-2 mb-6`}
            >
              {["tickets", "upcoming", "past", "settings"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="text-white/90 text-base px-5 py-2 rounded-full hover:bg-white/10 transition-all duration-150"
                >
                  {tab.charAt(0).toUpperCase() +
                    tab.slice(1).replace(/([A-Z])/g, " $1")}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="tickets">
              {ticketData.length === 0 ? (
                <Card className={`${glassCard} p-10 text-center`}>
                  <p className="text-white/80 mb-6 text-lg">
                    No tickets purchased yet.
                  </p>
                  <Button className={`${glassButton} px-6 py-2 rounded-full`}>
                    Explore Events
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {ticketData?.map((ticket) => (
                    <motion.div
                      key={ticket?._id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Card
                        className={`${glassCard} overflow-hidden flex flex-col`}
                      >
                        <div className="relative">
                          <img
                            src={ticket.event.images[0].url}
                            alt={ticket.event.title}
                            className="w-full h-52 object-cover object-center rounded-t-3xl"
                            style={{ filter: "brightness(0.9) contrast(1.05)" }}
                          />
                          <Badge
                            className={`absolute top-4 right-4 ${glassBadge} ${getStatusColor(
                              ticket.status
                            )} px-4 py-1`}
                          >
                            {ticket.status.charAt(0).toUpperCase() +
                              ticket.status.slice(1)}
                          </Badge>
                        </div>
                        <div
                          className={`${glassInner} flex-1 flex flex-col justify-between`}
                        >
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {ticket.event.title}
                            </h3>
                            <div className="space-y-1 text-white/70">
                              <div className="flex items-center gap-2">
                                <BiCalendar className="text-[#ffa509]" />
                                {ticket.event.date}
                              </div>
                              <div className="flex items-center gap-2">
                                <BiTime className="text-[#ffa509]" />
                                {ticket.event.time}
                              </div>
                              <div className="flex items-center gap-2">
                                <BiMap className="text-[#ffa509]" />
                                {ticket.event.location.address}
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 border-t border-white/10 pt-4">
                            <div className="flex flex-col items-center justify-center mb-4">
                              <p className="text-black text-sm mb-2">
                                Scan the QR code to download the ticket
                              </p>
                              <div className="bg-white/70 p-2 rounded-2xl shadow-md mb-2">
                                <QRCodeSVG
                                  value={`http://localhost:5173/ticket/view/${ticket._id}`}
                                  className="w-24 h-24"
                                />
                              </div>
                            </div>
                            <Button
                              className={`${glassButton} w-full py-2 rounded-full flex items-center justify-center`}
                            >
                              <BiDownload className="mr-2" />
                              Download Ticket
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Other Tabs */}
            <TabsContent value="upcoming">
              <Card className={`${glassCard} p-10 text-center`}>
                <p className="text-white/80 text-lg">
                  No upcoming events found.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="past">
              <Card className={`${glassCard} p-10 text-center`}>
                <p className="text-white/80 text-lg">No past events found.</p>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className={`${glassCard} p-10`}>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Account Settings
                </h2>
                <div className={`${glassInner}`}>
                  <p className="text-white/70">
                    Settings will be available soon.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
