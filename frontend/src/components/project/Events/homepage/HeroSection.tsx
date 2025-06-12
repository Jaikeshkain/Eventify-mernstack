import { GetUpcomingEventsAPI } from "@/services/EventService";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import LoadingSpinner from "../../LoadingSpinner";
import AlertMessage from "../../AlertMessage";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = ({fadeInUp,staggerChildren}:{fadeInUp:any,staggerChildren:any}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const thumbRefs = useRef<(HTMLImageElement | null)[]>([]);
    const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)
    const sliderRef = useRef<any>(null);

      const {
        data: upcomingEvents,
        isLoading: upcomingLoading,
        error: upcomingError,
      } = useQuery({
        queryKey: ["upcomingEvents"],
        queryFn: GetUpcomingEventsAPI,
      });

      const sliderSettings = {
        fade: true,
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        beforeChange: (_: number, next: number) => setCurrentIndex(next),
      };

        useEffect(() => {
          const target = thumbRefs.current[currentIndex];
          target?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }, [currentIndex]);

    return (
    <motion.section
      className="relative h-screen overflow-hidden"
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-orange-900/30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Stage Lights Effect */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 via-white/5 to-transparent z-10"></div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-8 z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 h-16 bg-gradient-to-b from-yellow-200 to-transparent rounded-full opacity-60"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleY: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {upcomingLoading ? (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      ) : upcomingError ? (
        <div className="flex items-center justify-center h-full">
          <AlertMessage
            type="error"
            message={(upcomingError as any)?.message}
          />
        </div>
      ) : (
        <Slider {...sliderSettings} className="h-full" ref={sliderRef}>
          {upcomingEvents?.events?.map((event: any) => (
            <div
              key={event._id}
              className="relative h-screen group"
              onMouseEnter={() => setHoveredEventId(event._id)}
              onMouseLeave={() => setHoveredEventId(null)}
            >
              <img
                src={event.images[0]?.url}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20" />

              {/* Default Event Info */}
              <motion.div
                className="absolute inset-0 z-30 flex items-center justify-center px-4"
                variants={fadeInUp}
              >
                <div className="text-center max-w-4xl mx-auto">
                  <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400 animate-pulse" />
                  <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-orange-300 bg-clip-text text-transparent">
                    {event.title}
                  </h1>
                  <div className="flex items-center justify-center space-x-4 mb-4 text-xl">
                    <Calendar className="w-6 h-6 text-orange-400" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4 mb-8 text-xl">
                    <MapPin className="w-6 h-6 text-orange-400" />
                    <span>{event.location?.venue}</span>
                  </div>
                  <Link to={`/events/${event._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-12 py-4 rounded-full text-xl font-semibold shadow-2xl shadow-orange-500/25 transition-all duration-300"
                    >
                      View Details
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Hover Details */}
              {hoveredEventId === event._id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40 max-w-2xl mx-4"
                >
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <p className="text-lg text-gray-200 mb-6 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-4 py-2">
                        {event.category}
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                        {event.attendees?.length || 0} Attendees
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </Slider>
      )}

      {/* Thumbnail Strip */}
      {upcomingEvents?.events && (
        <div className="absolute bottom-4 left-0 right-0 z-40 px-4">
          <div className="flex gap-3 justify-center items-center overflow-x-auto no-scrollbar">
            {upcomingEvents.events.map((event: any, index: number) => (
              <img
                key={event._id}
                src={event.images[0]?.url}
                alt={event.title}
                ref={(el: any) => (thumbRefs.current[index] = el)}
                onClick={() => {
                  sliderRef.current?.slickGoTo(index);
                  setCurrentIndex(index);
                }}
                className={`w-20 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                  index === currentIndex
                    ? "border-orange-500 scale-110 shadow-xl shadow-orange-500/50"
                    : "border-white/20 opacity-70 hover:opacity-100 hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.section>
    )
}

export default HeroSection;