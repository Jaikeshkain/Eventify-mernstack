import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Ticket, Users, Clock, Tag, Heart, Share2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categoryGradients = {
  Game: 'from-purple-600 via-pink-600 to-red-600',
  Technology: 'from-blue-600 via-cyan-500 to-teal-600',
  Music: 'from-green-500 via-emerald-500 to-blue-500',
  Sports: 'from-orange-500 via-red-500 to-pink-500',
  Business: 'from-gray-600 via-slate-700 to-black'
};

export default function TicketingPlatformCards({events}:{events:any}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-6xl font-black text-white mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            LIVE EVENTS
          </motion.h1>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <p className="text-xl text-slate-300">Book your tickets now</p>
        </motion.div>

        {/* Cards Grid */}
        <div className="space-y-12">
          {events?.map((event:any, index:number) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate=useNavigate()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    };
  };

  const { day, month, weekday } = formatDate(event.date);
  const attendancePercentage = (event.attendees / event.capacity) * 100;
  const categoryGradient = categoryGradients[event.category as keyof typeof categoryGradients] || categoryGradients.Business;

  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -100 : 100 }}
      whileInView={{
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.8,
          delay: 0.2,
          type: "spring",
          bounce: 0.3,
        },
      }}
      viewport={{ once: true, amount: 0.3 }}
      className="group"
    >
      <div
        className={`flex flex-col lg:flex-row ${
          isEven ? "lg:flex-row" : "lg:flex-row-reverse"
        } gap-8 items-center pb-10`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <motion.div
          className="relative w-full lg:w-1/2 h-80 overflow-hidden rounded-3xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <motion.img
            src={event.images[currentImageIndex]?.url}
            alt={event.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: isHovered ? 1.05 : 1.1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category Badge */}
          <motion.div
            className={`absolute top-6 left-6 px-4 py-2 rounded-full bg-gradient-to-r ${categoryGradient} text-white text-sm font-bold shadow-lg`}
            whileHover={{ scale: 1.1 }}
          >
            <Zap className="inline w-4 h-4 mr-1" />
            {event.category.toUpperCase()}
          </motion.div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Heart className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Image Navigation */}
          {event.images.length > 1 && (
            <div className="absolute bottom-6 left-6 flex gap-2">
              {event.images.map((_: any, imgIndex: number) => (
                <button
                  key={imgIndex}
                  onClick={() => setCurrentImageIndex(imgIndex)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    imgIndex === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Price Tag */}
          <motion.div
            className="absolute bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-lg shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            ₹{event.price}
          </motion.div>
        </motion.div>

        {/* Content Section */}
        <div className="w-full relative lg:w-1/2 space-y-6">
          {/* Date Section */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 text-center shadow-xl">
              <div className="text-3xl font-black text-slate-900">{day}</div>
              <div className="text-sm font-bold text-slate-600">{month}</div>
              <div className="text-xs text-slate-500">{weekday}</div>
            </div>
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-lg font-semibold">{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">{event.type}</span>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-4xl font-black text-white mb-2 leading-tight">
              {event.title}
            </h2>
            <p className="text-xl text-purple-300 font-medium mb-3">
              {event.subtitle}
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              {event.description}
            </p>
          </motion.div>

          {/* Location & Stats */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-5 h-5 text-red-400" />
              <div>
                <div className="font-semibold">{event.location.venue}</div>
                <div className="text-sm text-slate-400">
                  {event.location.address}
                </div>
              </div>
            </div>

            {/* Attendance Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {event.attendees} / {event.capacity} attending
                </span>
                <span className="text-purple-400 font-semibold">
                  {attendancePercentage.toFixed(0)}% full
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${attendancePercentage}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={() => navigate(`/events/${event._id}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(168, 85, 247, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            className={`w-1/2 absolute bg-gradient-to-r ${categoryGradient} text-white font-bold py-4 px-8 rounded-2xl shadow-2xl flex items-center justify-center gap-3 text-lg transition-all duration-300 hover:shadow-purple-500/50`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Ticket className="w-6 h-6" />
            <span>BOOK NOW</span>
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}