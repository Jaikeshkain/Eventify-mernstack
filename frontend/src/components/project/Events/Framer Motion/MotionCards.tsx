import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { GetEventsAPI } from "@/services/EventService";
import { Link } from "react-router-dom";
import {Ticket } from "lucide-react";
import LoadingSpinner from "../../LoadingSpinner";
import AlertMessage from "../../AlertMessage";

export default function ScrollTriggered() {
  const {
    data: popularEvents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["popularEvents"],
    queryFn: () =>
      GetEventsAPI({ sortBy: "attendees", order: "desc", limit: 6 }),
  });

  if (isLoading)
    return <LoadingSpinner />;
  if (error || !popularEvents)
    return (
      <AlertMessage type="error" message={(error as any)?.message} />
    );

  return (
    <div style={container}>
      {popularEvents?.events?.map((event: any, i: number) => {
        const hueA = 30 + i * 30;
        const hueB = hueA + 30;
        return (
          <Card
            key={event?._id}
            id={event?._id}
            i={i}
            hueA={hueA}
            hueB={hueB}
            images={event?.images[0]?.url}
            title={event?.title}
            date={event?.date.split("T")[0]}
            location={event?.location?.address?event?.location?.address:event?.location?.venue}
          />
        );
      })}
    </div>
  );
}

interface CardProps {
  id:string
  images: any;
  title: string;
  hueA: number;
  hueB: number;
  i: number;
  date:string;
  location:string;
}

function Card({ images, title, hueA, hueB, i,date,location,id }: CardProps) {
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`;

  return (
    <motion.div
      className={`card-container-${i}`}
      style={cardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
      <div style={{ ...splash, background }} />
      <motion.div
        style={card}
        variants={cardVariants}
        className="card group relative overflow-hidden"
      >
        <motion.img
          src={images}
          alt={title}
          className="w-full h-full object-cover rounded-[20px]"
          whileHover={{ y: 15 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
        <div className="absolute top-0 left-0 right-0 bg-black/40 backdrop-blur-md text-white text-center opacity-100  translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out rounded-b-[20px] px-4 py-3">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <p className="text-sm text-gray-200 mt-1">{date}</p>
          <p className="text-sm text-gray-300">{location}</p>

          <Link to={`/events/${id}`} className="inline-block">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:brightness-110 text-sm font-semibold shadow-md shadow-pink-500/30 hover:shadow-pink-500/50 flex items-center justify-center gap-2 transition-all duration-300"
            >
              <Ticket className="w-4 h-4" />
              <span>Get Tickets</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}


const cardVariants: Variants = {
  offscreen: {
    y: 300,
  },
  onscreen: {
    y: 50,
    rotate: -10,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const hue = (h: number) => `hsl(${h}, 100%, 50%)`;

/**
 * ==============   Styles   ================
 */

const container: React.CSSProperties = {
  margin: "100px auto",
  maxWidth: 500,
  paddingBottom: 100,
  width: "100%",
};

const cardContainer: React.CSSProperties = {
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  paddingTop: 20,
  marginBottom: -120,
};

const splash: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
};

const card: React.CSSProperties = {
  fontSize: 164,
  width: 300,
  height: 430,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 20,
  background: "#f5f5f5",
  boxShadow:
    "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
  transformOrigin: "10% 60%",
};
