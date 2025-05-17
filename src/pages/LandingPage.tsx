
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnterApp = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 800); // Delay to allow for animation
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background with gradient and particle effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-mindful-soft via-white to-mindful-light overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-mindful-primary animate-float"
              style={{
                width: `${Math.random() * 40 + 10}px`,
                height: `${Math.random() * 40 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 7 + 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`text-center z-10 px-6 transition-all duration-500 ease-in-out ${
          isTransitioning ? "opacity-0 transform translate-y-10" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-20 w-20 rounded-full bg-mindful-primary animate-pulse-glow group-hover:animate-pulse transition-all" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-mindful-primary to-mindful-tertiary text-transparent bg-clip-text">
          MindfulMe
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-md mx-auto">
          Nurturing Your Mind, One Moment at a Time
        </p>

        {/* Description */}
        <p className="text-gray-600 mb-10 max-w-lg mx-auto">
          Your personal companion for mental wellness, providing tools to track mood, 
          journal your thoughts, practice meditation, and discover helpful resources.
        </p>

        {/* Enter button */}
        <Button
          onClick={handleEnterApp}
          className="px-8 py-6 text-lg rounded-full hover:scale-105 transition-all duration-300"
        >
          Begin Your Journey
        </Button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
