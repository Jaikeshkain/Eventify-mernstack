import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Play, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetUpcomingEventsAPI } from "@/services/EventService";
import { useNavigate } from "react-router-dom";
import ModernLoadingSpinner from "../../MorderLoadingSpin";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate=useNavigate()

  const {
    data: upcomingEvents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: GetUpcomingEventsAPI,
  });

  const events = upcomingEvents?.events || [];

  useEffect(() => {
    if (!isAutoPlaying || events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, events.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) return <ModernLoadingSpinner/>;
  if (error)
    return <div className="text-red-400 p-10">Error loading events.</div>;
  if (!events.length)
    return <div className="text-gray-400 p-10">No events available.</div>;

  const currentEvent = events[currentSlide];

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentEvent?.images?.[0]?.url})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70" />
        </motion.div>
      </AnimatePresence>

      {/* Thumbnail Navigation */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30">
        <div className="flex flex-col space-y-4">
          <motion.button
            onClick={prevSlide}
            className="p-2 bg-white/20 rounded-full text-white"
          >
            <ChevronUp size={20} />
          </motion.button>

          <div className="flex flex-col space-y-3">
            {events.map((event: any, index: number) => (
              <motion.div
                key={event._id}
                onClick={() => goToSlide(index)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  currentSlide === index
                    ? "border-white shadow-lg"
                    : "border-white/30 hover:border-white/60"
                }`}
              >
                <img
                  src={event?.images?.[0]?.url}
                  className="w-full h-full object-cover"
                />
                {currentSlide === index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                  >
                    <Play className="text-white" size={16} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={nextSlide}
            className="p-2 bg-white/20 rounded-full text-white"
          >
            <ChevronDown size={20} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-8 ml-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <motion.div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-white" />
                <span className="text-sm bg-gradient-to-r from-pink-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent uppercase tracking-wider">
                  {currentEvent?.subtitle || "Featured Event"}
                </span>
              </motion.div>

              <motion.h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6 leading-tight">
                {currentEvent?.title}
              </motion.h1>

              <motion.p className="text-xl text-gray-200 mb-8 max-w-2xl">
                {currentEvent?.description?.slice(0, 200)}...
              </motion.p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.button
                  onClick={() => navigate(`/events/${currentEvent._id}`)}
                  className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100"
                >
                  Explore
                </motion.button>

                <motion.button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white/10"
                >
                  {isAutoPlaying ? "Pause Auto-Play" : "Resume Auto-Play"}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-3">
          {events.map((_: any, index: number) => (
            <motion.div
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full cursor-pointer ${
                currentSlide === index ? "w-12 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Lights */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 right-20 w-4 h-4 bg-white/30 rounded-full blur-sm"
      />
    </div>
  );
};

export default HeroSlider;
