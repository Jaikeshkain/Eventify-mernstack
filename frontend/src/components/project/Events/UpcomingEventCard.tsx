import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BiCalendar, BiMap, BiTime } from "react-icons/bi";
import { FaTicketAlt } from "react-icons/fa";

interface UpcomingEventCardProps {
  event: {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: {
      venue: string;
      address: string;
      link: string;
    };
    price: number;
    images: Array<{ url: string; publicId: string }>;
    category: string;
  };
}

const UpcomingEventCard = ({ event }: UpcomingEventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]">
        <div className="relative">
          <img
            src={event.images[0]?.url}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <Badge className="absolute top-4 right-4 bg-[#ffa509] text-[#050b2c] px-4 py-1 rounded-full">
            {event.category}
          </Badge>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          
          <div className="space-y-2 text-gray-300">
            <div className="flex items-center gap-2">
              <BiCalendar className="text-[#ffa509]" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <BiTime className="text-[#ffa509]" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <BiMap className="text-[#ffa509]" />
              <span>{event.location.venue}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="text-[#ffa509] font-bold">
              ${event.price}
            </div>
            <Button className="bg-[#ffa509] text-[#050b2c] hover:bg-[#ff9100] transition-colors">
              <FaTicketAlt className="mr-2" />
              Get Tickets
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default UpcomingEventCard;