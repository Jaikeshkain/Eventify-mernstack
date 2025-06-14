import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { GetEventByIdAPI } from "@/services/EventService";
import { useAuth } from "@/context/AuthContext";
import NotLogin from "@/components/project/auth/NotLogin";

// Types
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    venue: string;
    address: string;
  };
  images: { url: string }[];
  price: number;
}

export default function TicketPurchase() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const {userData}=useAuth()

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  // Fetch event details
  const { data, isLoading } = useQuery<{event:Event}>({
    queryKey: ["event", id],
    queryFn: () => GetEventByIdAPI(id!)
  });

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050b2c] to-[#0a1854] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffa509]"></div>
      </div>
    );
  }

  if (!data?.event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050b2c] to-[#0a1854] flex items-center justify-center">
        <div className="text-white">Event not found</div>
      </div>
    );
  }

    if (!userData) {
      return <NotLogin />;
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050b2c] to-[#0a1854] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Banner */}
            <Card className="overflow-hidden bg-white/10 backdrop-blur-lg border-none">
              <img
                src={data?.event?.images[0]?.url}
                alt={data?.event?.title}
                className="w-full h-64 object-cover"
              />
            </Card>

            {/* Event Info */}
            <Card className="bg-white/10 backdrop-blur-lg border-none p-6">
              <h1 className="text-3xl font-bold text-white mb-4">
                {data?.event?.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <FaCalendarAlt className="text-[#ffa509] mr-2" />
                  <span>
                    {new Date(data?.event?.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FaClock className="text-[#ffa509] mr-2" />
                  <span>{data?.event?.time}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FaMapMarkerAlt className="text-[#ffa509] mr-2" />
                  <span>{data?.event?.location?.venue}</span>
                </div>
              </div>

              <div className="text-gray-300">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Description
                </h2>
                <p>{data?.event?.description}</p>
              </div>
            </Card>
          </div>

          {/* Right Column - Ticket Purchase */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-lg border-none p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Get Your Tickets
              </h2>

              {/* Ticket Quantity */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  Ticket Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => handleQuantityChange(-1)}
                    className="bg-white/10 text-white border-none hover:bg-white/20"
                  >
                    -
                  </Button>
                  <span className="text-white text-xl">{quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() => handleQuantityChange(1)}
                    className="bg-white/10 text-white border-none hover:bg-white/20"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Price per ticket</span>
                  <span>₹{data?.event?.price}</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{data?.event?.price * quantity}</span>
                </div>
              </div>

              {/* Buy Button */}
              <Button
                onClick={()=>navigate(`/payment/${data?.event?.price}/${quantity}/${data?.event?.title}/${userData?._id}/${data?.event?._id}`)}
                className="w-full bg-[#ffa509] hover:bg-[#ff9100] text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                Buy Ticket with UPI
              </Button>
            </Card>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
} 