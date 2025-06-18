import { motion } from "framer-motion";

export default function ModernLoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-24 h-24 border-4 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute top-2 left-2 w-20 h-20 border-4 border-transparent border-t-purple-400 border-l-purple-400 rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute top-4 left-4 w-16 h-16 border-4 border-transparent border-b-pink-400 border-r-pink-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Center dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orbital dots */}
        {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
          <motion.div
            key={index}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
            animate={{
              rotate: rotation + 360,
              x: [0, 40, 0, -40, 0],
              y: [0, -40, 0, 40, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.1,
            }}
          />
        ))}

        {/* Pulsing background glow */}
        <motion.div
          className="absolute inset-0 w-32 h-32 -top-4 -left-4 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading text */}
      <motion.div
        className="absolute mt-32 text-white font-light text-lg tracking-wider"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.div>

      {/* Progress dots */}
      <div className="absolute mt-44 flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-white/60 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
