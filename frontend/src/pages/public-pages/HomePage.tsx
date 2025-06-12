import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Slider from 'react-slick';
import { GetEventsAPI, GetUpcomingEventsAPI } from '@/services/EventService';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/project/LoadingSpinner';
import AlertMessage from '@/components/project/AlertMessage';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Music, 
  Laptop, 
  Palette,
  Volleyball,
  UtensilsCrossed,
  Briefcase,
  BookOpen,
  MoreHorizontal,
  Ticket
} from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const iconMap: Record<string, React.ReactNode> = {
  Music: <Music className="w-6 h-6" />,
  Technology: <Laptop className="w-6 h-6" />,
  Art: <Palette className="w-6 h-6" />,
  Sports: <Volleyball className="w-6 h-6" />,
  Food: <UtensilsCrossed className="w-6 h-6" />,
  Business: <Briefcase className="w-6 h-6" />,
  Education: <BookOpen className="w-6 h-6" />,
  Other: <MoreHorizontal className="w-6 h-6" />,
};

const EventHomepage: React.FC = () => {
  const { userData } = useAuth();
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const sliderRef = useRef<any>(null);
  const thumbRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Backend API calls
  const {
    data: upcomingEvents,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: GetUpcomingEventsAPI,
  });

  const {
    data: popularEvents,
    isLoading: popularLoading,
    error: popularError,
  } = useQuery({
    queryKey: ['popularEvents'],
    queryFn: () =>
      GetEventsAPI({ sortBy: 'attendees', order: 'desc', limit: 6 }),
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
  accessibility: false, // important!
  beforeChange: (_: number, next: number) => setCurrentIndex(next),
};


  // useEffect(() => {
  //   const target = thumbRefs.current[currentIndex];
  //   target?.scrollIntoView({
  //     behavior: 'smooth',
  //     inline: 'center',
  //     block: 'nearest',
  //   });
  // }, [currentIndex]);

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Hero Section with Slider */}
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
                scaleY: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity
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
          <Slider {...sliderSettings} className="h-full" ref={sliderRef} accessibility={false}>
            {upcomingEvents?.events?.map((event: any) => (
              <div
                key={event?._id}
                className="relative h-screen group"
                onMouseEnter={() => setHoveredEventId(event?._id)}
                onMouseLeave={() => setHoveredEventId(null)}
              >
                <img
                  src={event?.images[0]?.url}
                  alt={event?.title}
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
                      {event?.title}
                    </h1>
                    <div className="flex items-center justify-center space-x-4 mb-4 text-xl">
                      <Calendar className="w-6 h-6 text-orange-400" />
                      <span>{new Date(event?.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-4 mb-8 text-xl">
                      <MapPin className="w-6 h-6 text-orange-400" />
                      <span>{event?.location?.venue}</span>
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
                        {event?.description}
                      </p>
                      <div className="flex flex-wrap justify-center gap-4 mb-6">
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-4 py-2">
                          {event?.category}
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                          {event?.attendees?.length || 0} Attendees
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
              {upcomingEvents?.events?.map((event: any, index: number) => (
                <img
                  key={event?._id}
                  src={event?.images[0]?.url}
                  alt={event?.title}
                  ref={(el: any) => (thumbRefs.current[index] = el)}
                  onClick={() => {
                    sliderRef.current?.slickGoTo(index);
                    setCurrentIndex(index);
                  }}
                  className={`w-20 h-14 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                    index === currentIndex
                      ? 'border-orange-500 scale-110 shadow-xl shadow-orange-500/50'
                      : 'border-white/20 opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </motion.section>

      {/* Popular Events Section */}
      <motion.section 
        className="relative py-24 px-4 bg-gradient-to-br from-slate-800 via-slate-900 to-black"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #ffa509 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #ff6b6b 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="flex justify-between items-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Popular Events
            </h2>
            <Link to="/events">
              <motion.button 
                whileHover={{ x: 5, scale: 1.05 }}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-orange-400 hover:bg-white/20 transition-all duration-300"
              >
                <span>View All Events</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
          
          {popularLoading ? (
            <LoadingSpinner />
          ) : popularError ? (
            <AlertMessage type="error" message={(popularError as any)?.message} />
          ) : (
            <motion.div 
              variants={staggerChildren}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {popularEvents?.events?.map((event: any) => (
                <motion.div
                  key={event._id}
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-orange-500/50 transition-all duration-500"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event?.images[0]?.url}
                      alt={event?.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <Badge className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1">
                      {event?.category}
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-400 transition-colors line-clamp-2">
                      {event?.title}
                    </h3>
                    <div className="space-y-3 text-slate-300 mb-6">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span>{new Date(event?.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span className="line-clamp-1">{event?.location?.venue}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-orange-400" />
                        <span>{event?.attendees?.length || 0} attending</span>
                      </div>
                    </div>
                    
                    <Link to={`/events/${event._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center justify-center space-x-2"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Get Tickets</span>
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>


      {/* Host Event Section - Only for Organizers */}
      {userData?.role === 'organizer' && (
        <motion.section 
          className="relative py-24 px-4 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-orange-900/20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5"></div>
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-16 h-16 mx-auto mb-6 text-orange-400" />
                </motion.div>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Ready to Host Your Event?
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Create and manage your events with our powerful tools and AI-driven assistance.
                </p>
                <Link to="/create-event">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-12 py-4 rounded-full text-xl font-semibold shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 inline-flex items-center space-x-2"
                  >
                    <span>Create Your Event</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Event Categories */}
      <motion.section 
        className="relative py-24 px-4 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,165,9,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,165,9,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Event Categories
          </motion.h2>
          
          <motion.div variants={staggerChildren} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(iconMap).map(([category, icon]) => (
              <motion.div
                key={category}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-orange-500/50 p-8 text-center cursor-pointer transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-white">
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-orange-400 transition-colors">
                    {category}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default EventHomepage;